-- ============================================
-- Migración 003: Plantillas WhatsApp configurables
-- ============================================

-- Enum para tipos de plantilla
CREATE TYPE whatsapp_template_type AS ENUM (
  'reminder_soft',
  'reminder_due_day',
  'reminder_overdue',
  'payment_thanks',
  'account_statement'
);

-- Tabla de plantillas
CREATE TABLE whatsapp_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  template_type whatsapp_template_type NOT NULL,
  name TEXT NOT NULL,
  message_body TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(business_id, template_type, deleted_at)
);

-- RLS
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON whatsapp_templates FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

CREATE POLICY "Users can insert own templates"
  ON whatsapp_templates FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

CREATE POLICY "Users can update own templates"
  ON whatsapp_templates FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

-- Trigger de updated_at
DROP TRIGGER IF EXISTS trg_whatsapp_templates_updated ON whatsapp_templates;
CREATE TRIGGER trg_whatsapp_templates_updated
  BEFORE UPDATE ON whatsapp_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed: plantillas por defecto para negocios existentes
-- ============================================
INSERT INTO whatsapp_templates (business_id, template_type, name, message_body, is_default)
SELECT
  b.id,
  t.template_type,
  t.name,
  t.message_body,
  true
FROM businesses b
CROSS JOIN (
  VALUES
    ('reminder_soft'::whatsapp_template_type,
     'Recordatorio suave',
     'Hola {nombre}, te recordamos que tu saldo de {monto} vence el {fecha_vencimiento}. ¿Podemos coordinar el pago? Quedo atento.'),
    ('reminder_due_day'::whatsapp_template_type,
     'Día de vencimiento',
     'Hola {nombre}, hoy vence tu saldo de {monto} de la venta #{numero_venta}. ¿Ya pudiste realizar el pago? Quedo pendiente.'),
    ('reminder_overdue'::whatsapp_template_type,
     'Cobro post-vencimiento',
     'Hola {nombre}, tu saldo de {monto} lleva {dias_vencido} días de vencido. Necesitamos coordinar el pago lo antes posible. ¿Cuándo puedes abonar?'),
    ('payment_thanks'::whatsapp_template_type,
     'Agradecimiento por pago',
     'Hola {nombre}, confirmamos tu pago de {monto_pagado}. Tu nuevo saldo es {saldo_pendiente}. ¡Gracias por tu puntualidad!'),
    ('account_statement'::whatsapp_template_type,
     'Envío de estado de cuenta',
     'Hola {nombre}, te envío tu estado de cuenta actualizado. Tu saldo pendiente total es {saldo_total}. Cualquier duda quedo atento.')
) AS t(template_type, name, message_body)
WHERE b.deleted_at IS NULL;

-- ============================================
-- Actualizar handle_new_user para incluir plantillas
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_business_id UUID;
BEGIN
  -- Crear negocio
  INSERT INTO businesses (user_id, name, currency, timezone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Negocio'), 'COP', 'America/Bogota')
  RETURNING id INTO new_business_id;

  -- Insertar plantillas WhatsApp por defecto
  INSERT INTO whatsapp_templates (business_id, template_type, name, message_body, is_default)
  VALUES
    (new_business_id, 'reminder_soft', 'Recordatorio suave',
     'Hola {nombre}, te recordamos que tu saldo de {monto} vence el {fecha_vencimiento}. ¿Podemos coordinar el pago? Quedo atento.', true),
    (new_business_id, 'reminder_due_day', 'Día de vencimiento',
     'Hola {nombre}, hoy vence tu saldo de {monto} de la venta #{numero_venta}. ¿Ya pudiste realizar el pago? Quedo pendiente.', true),
    (new_business_id, 'reminder_overdue', 'Cobro post-vencimiento',
     'Hola {nombre}, tu saldo de {monto} lleva {dias_vencido} días de vencido. Necesitamos coordinar el pago lo antes posible. ¿Cuándo puedes abonar?', true),
    (new_business_id, 'payment_thanks', 'Agradecimiento por pago',
     'Hola {nombre}, confirmamos tu pago de {monto_pagado}. Tu nuevo saldo es {saldo_pendiente}. ¡Gracias por tu puntualidad!', true),
    (new_business_id, 'account_statement', 'Envío de estado de cuenta',
     'Hola {nombre}, te envío tu estado de cuenta actualizado. Tu saldo pendiente total es {saldo_total}. Cualquier duda quedo atento.', true);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

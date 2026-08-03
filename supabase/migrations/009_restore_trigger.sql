CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_business_id UUID;
BEGIN
  -- Crear negocio
  INSERT INTO businesses (user_id, name, currency, timezone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Negocio'), 'COP', 'America/Bogota')
  RETURNING id INTO new_business_id;

  -- Insertar plantillas WhatsApp por defecto con CAST a ENUM
  INSERT INTO whatsapp_templates (business_id, template_type, name, message_body, is_default)
  VALUES
    (new_business_id, 'reminder_soft'::whatsapp_template_type, 'Recordatorio suave',
     'Hola {nombre}, te recordamos que tu saldo de {monto} vence el {fecha_vencimiento}. ¿Podemos coordinar el pago? Quedo atento.', true),
    (new_business_id, 'reminder_due_day'::whatsapp_template_type, 'Día de vencimiento',
     'Hola {nombre}, hoy vence tu saldo de {monto} de la venta #{numero_venta}. ¿Ya pudiste realizar el pago? Quedo pendiente.', true),
    (new_business_id, 'reminder_overdue'::whatsapp_template_type, 'Cobro post-vencimiento',
     'Hola {nombre}, tu saldo de {monto} lleva {dias_vencido} días de vencido. Necesitamos coordinar el pago lo antes posible. ¿Cuándo puedes abonar?', true),
    (new_business_id, 'payment_thanks'::whatsapp_template_type, 'Agradecimiento por pago',
     'Hola {nombre}, confirmamos tu pago de {monto_pagado}. Tu nuevo saldo es {saldo_pendiente}. ¡Gracias por tu puntualidad!', true),
    (new_business_id, 'account_statement'::whatsapp_template_type, 'Envío de estado de cuenta',
     'Hola {nombre}, te envío tu estado de cuenta actualizado. Tu saldo pendiente total es {saldo_total}. Cualquier duda quedo atento.', true);

  RETURN NEW;
END;
$$;

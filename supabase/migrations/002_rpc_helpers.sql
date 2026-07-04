-- SeguimientoPro — Fase 2: RPC helpers
-- Propósito: funciones auxiliares para queries del dashboard y health score.
-- Fecha: 2026-07-03

-- Cuenta clientes con al menos una gestión de cobro en los últimos N días
-- cuyas ventas aún tienen saldo pendiente.
CREATE OR REPLACE FUNCTION count_clients_with_recent_action(
  p_business_id UUID,
  p_days INTEGER DEFAULT 7
) RETURNS INTEGER
LANGUAGE sql SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(DISTINCT ca.client_id)::INTEGER
  FROM collection_actions ca
  JOIN sales s ON ca.sale_id = s.id
  WHERE ca.business_id = p_business_id
    AND ca.action_date >= NOW() - (p_days || ' days')::INTERVAL
    AND s.balance > 0
    AND s.deleted_at IS NULL;
$$;

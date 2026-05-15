-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount      numeric(10,2) NOT NULL,
  date        date NOT NULL,
  type        text CHECK (type IN ('income', 'expense')) NOT NULL,
  category    text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para performance em filtros por usuário e data
CREATE INDEX IF NOT EXISTS transactions_user_id_date_idx
  ON transactions (user_id, date DESC);

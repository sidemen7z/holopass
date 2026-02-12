-- Create function to increment user XP
CREATE OR REPLACE FUNCTION increment_user_xp(user_id UUID, xp_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO users (id, xp, level)
  VALUES (user_id, xp_amount, 1)
  ON CONFLICT (id)
  DO UPDATE SET 
    xp = users.xp + xp_amount,
    level = CASE 
      WHEN (users.xp + xp_amount) >= 1000 THEN 5
      WHEN (users.xp + xp_amount) >= 500 THEN 4
      WHEN (users.xp + xp_amount) >= 250 THEN 3
      WHEN (users.xp + xp_amount) >= 100 THEN 2
      ELSE 1
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

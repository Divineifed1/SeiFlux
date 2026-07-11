-- Add missing columns to waves if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waves' AND column_name = 'createdat') THEN
    ALTER TABLE waves ADD COLUMN createdat TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waves' AND column_name = 'updatedat') THEN
    ALTER TABLE waves ADD COLUMN updatedat TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waves' AND column_name = 'totalpoints') THEN
    ALTER TABLE waves ADD COLUMN totalpoints INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waves' AND column_name = 'participantcount') THEN
    ALTER TABLE waves ADD COLUMN participantcount INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Add wave_id to applications if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'wave_id') THEN
    ALTER TABLE applications ADD COLUMN wave_id UUID;
  END IF;
END $$;

-- Auto-update updatedat on waves
CREATE OR REPLACE FUNCTION update_waves_updatedat()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedat = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_waves_updatedat ON waves;

CREATE TRIGGER update_waves_updatedat
BEFORE UPDATE ON waves
FOR EACH ROW
EXECUTE FUNCTION update_waves_updatedat();
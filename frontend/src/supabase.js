import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vblylwfrqblecxuoybuu.supabase.co'
const supabaseKey = 'sb_publishable_NBjOaC0wCHUZJVivHO75xw_ZXDHXA2j'

export const supabase = createClient(supabaseUrl, supabaseKey)

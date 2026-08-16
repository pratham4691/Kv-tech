import { createSupabaseServerClient } from './server'

export type AdminAccess = {
  user: {
    id: string
    email?: string | null
  }
  role: 'SUPER_ADMIN'
}

export async function getAdminUser(): Promise<AdminAccess | null> {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return null
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: adminRow, error: adminError } = await supabase
    .from('admin_users')
    .select('role, is_active')
    .eq('user_id', user.id)
    .maybeSingle()

  if (adminError || !adminRow || !adminRow.is_active) {
    return null
  }

  if (adminRow.role !== 'SUPER_ADMIN') {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    role: adminRow.role,
  }
}

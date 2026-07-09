import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platformId = searchParams.get('platformId');
  const key = searchParams.get('key');

  if (!platformId || !key) {
    return NextResponse.json({ error: 'Missing platformId or key' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('feature_flags')
    .select('is_enabled')
    .eq('platform_id', platformId)
    .eq('key', key)
    .single();

  if (error || !data) {
    return NextResponse.json({ is_enabled: false, message: 'Flag not found' }, { status: 404 });
  }

  return NextResponse.json({ is_enabled: data.is_enabled });
}


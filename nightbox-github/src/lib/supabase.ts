import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema para criação no Supabase:
 * 
 * -- TABELA DE PRODUTOS
 * create table if not exists products (
 *   id text primary key,
 *   name text not null,
 *   description text,
 *   price numeric not null,
 *   original_price numeric,
 *   category text not null,
 *   image_url text not null,
 *   volume text,
 *   alcohol_content text,
 *   in_stock boolean default true,
 *   featured boolean default false,
 *   is_cold boolean default false,
 *   rating numeric default 5.0,
 *   created_at timestamp with time zone default timezone('utc'::text, now())
 * );
 * 
 * -- TABELA DE PEDIDOS
 * create table if not exists orders (
 *   id text primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()),
 *   customer jsonb not null,
 *   delivery_type text not null,
 *   address jsonb,
 *   items jsonb not null,
 *   subtotal numeric not null,
 *   delivery_fee numeric not null,
 *   discount numeric default 0,
 *   total numeric not null,
 *   payment_method text not null,
 *   payment_status text not null,
 *   order_status text not null,
 *   notes text,
 *   change_for numeric,
 *   pix_qr_code text,
 *   pix_copia_e_cola text
 * );
 * 
 * -- TABELA DE CONFIGURAÇÕES DA LOJA
 * create table if not exists store_config (
 *   id text primary key default 'default',
 *   name text not null,
 *   tagline text,
 *   phone text,
 *   whatsapp text,
 *   address text,
 *   is_open boolean default true,
 *   opening_hours text,
 *   estimated_delivery_time text,
 *   default_delivery_fee numeric,
 *   free_delivery_threshold numeric,
 *   mercado_pago_public_key text,
 *   mercado_pago_access_token text,
 *   updated_at timestamp with time zone default timezone('utc'::text, now())
 * );
 */

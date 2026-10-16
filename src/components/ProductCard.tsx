'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Zap, CheckCircle2, Shield, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { AZ } from '@/lib/translations';

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    gameTitle: string;
    price: number;
    discountPrice?: number | null;
    coverImage: string;
    platform: string;
    accountType: string;
    deliveryType: string;
    badge?: string | null;
    stock: number;
    isAvailable: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const isDiscounted = product.discountPrice && product.discountPrice > product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.discountPrice! - product.price) / product.discountPrice!) * 100)
    : null;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#111119] border border-[#20202e] hover:border-red-600/40 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-950/20">
      
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c0c14]">
        <Image
          src={product.coverImage || '/games/gta5.jpg'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111119] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-red-600 text-white shadow-md shadow-red-950">
              {AZ.badges[product.badge as keyof typeof AZ.badges] || product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-500 text-black shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Platform tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-black/70 backdrop-blur-md text-gray-300 border border-white/10">
            {product.platform}
          </span>
        </div>

        {/* Delivery indicator */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-[#0d0d14]/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-emerald-500/20">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Ani Çatdırılma</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        
        {/* Game Title & Account Type */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
            {product.gameTitle}
          </span>
          <Link href={`/catalog/${product.slug || product.id}`}>
            <h3 className="text-sm font-bold text-gray-100 line-clamp-2 hover:text-red-400 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate">Tam Giriş (Email & Şifrə dəyişir)</span>
        </div>

        {/* Stock & Availability Status */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? 'bg-emerald-500 pulse-glow' : 'bg-red-500'
              }`}
            />
            <span className={product.stock > 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
              {product.stock > 0 ? `Anbarda: ${product.stock} ədəd` : 'Bitib (Tükəndi)'}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 mt-auto border-t border-[#1c1c2a] flex items-center justify-between">
          <div className="flex flex-col">
            {isDiscounted && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatPrice(product.discountPrice!)}
              </span>
            )}
            <span className="text-lg font-black text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/catalog/${product.slug || product.id}`}
              className="p-2 rounded-xl bg-[#191925] hover:bg-[#232334] text-gray-300 hover:text-white transition-colors border border-[#27273a]"
              title="Ətraflı Bax"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => addItem(product)}
              disabled={product.stock <= 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                product.stock > 0
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/40 hover:shadow-red-600/30'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Səbətə At</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

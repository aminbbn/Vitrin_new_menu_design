import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, Wifi, Instagram, Compass, ExternalLink } from 'lucide-react';
import { RestaurantData } from '../../types/menu';
import { toPersianDigits } from '../../utils/formatters';

interface RestaurantInfoModalProps {
  restaurant: RestaurantData;
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
}

export const RestaurantInfoModal: React.FC<RestaurantInfoModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  accentColor = '#d4af37',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl z-10 text-neutral-100 p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-12 h-12 rounded-2xl object-cover border border-white/10"
              />
              <div>
                <h3 className="font-bold text-lg text-white">{restaurant.name}</h3>
                <p className="text-xs text-neutral-400 font-light">{restaurant.cuisine}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              id="close-restaurant-info-btn"
              className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info blocks */}
          <div className="space-y-3.5 text-sm">
            {/* Address */}
            <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex items-start gap-3">
              <div
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-neutral-400 font-medium mb-0.5">آدرس و موقعیت</div>
                <div className="text-neutral-200 text-xs sm:text-sm leading-relaxed">{toPersianDigits(restaurant.address)}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
                  <Compass className="w-3.5 h-3.5" />
                  مسیریابی با نشان و بلد
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex items-start gap-3">
              <div
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium mb-0.5">ساعات پذیرایی</div>
                <div className="text-neutral-200 text-xs sm:text-sm">{toPersianDigits(restaurant.workingHours)}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex items-start gap-3">
              <div
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium mb-0.5">شماره تماس پشتیبانی و رزرو سالن</div>
                <a
                  href={`tel:${restaurant.socials.phone}`}
                  className="text-neutral-100 font-medium text-sm underline decoration-neutral-600 hover:text-amber-400"
                  dir="ltr"
                >
                  {restaurant.phone}
                </a>
              </div>
            </div>

            {/* WiFi */}
            {restaurant.wifiName && (
              <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex items-start gap-3">
                <div
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 font-medium mb-0.5">اینترنت وای‌فای مهمانان</div>
                  <div className="text-xs text-neutral-200">
                    نام شبکه: <span className="text-white font-semibold">{restaurant.wifiName}</span>
                  </div>
                  {restaurant.wifiPassword && (
                    <div className="text-xs text-neutral-300 mt-1">
                      رمز عبور: <span className="bg-neutral-800 px-2 py-0.5 rounded text-amber-300 select-all font-medium">{restaurant.wifiPassword}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social */}
            {restaurant.socials.instagram && (
              <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex items-start gap-3">
                <div
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400 font-medium mb-0.5">صفحه رسمی اینستاگرام</div>
                    <div className="text-xs text-neutral-200 font-medium" dir="ltr">{restaurant.socials.instagram}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm transition-colors"
          >
            بستن
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

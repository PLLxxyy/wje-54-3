import { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { FoodItem, FoodPreset, StorageLocation } from '@/types';
import { useFoodStore } from '@/store/useFoodStore';
import { getTodayISO } from '@/utils/dateUtils';
import { unitOptions, locationNames, findPresetByName } from '@/utils/foodPresets';
import FoodPresetPicker from './FoodPresetPicker';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  editFood?: FoodItem | null;
}

const initialFormData = {
  name: '',
  purchaseDate: getTodayISO(),
  shelfLifeDays: 7,
  location: 'fridge' as StorageLocation,
  quantity: 1,
  unit: '个',
  photo: undefined as string | undefined,
  emoji: undefined as string | undefined,
};

export default function AddFoodModal({ isOpen, onClose, editFood }: AddFoodModalProps) {
  const { addFood, updateFood } = useFoodStore();
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editFood) {
      setFormData({
        name: editFood.name,
        purchaseDate: editFood.purchaseDate,
        shelfLifeDays: editFood.shelfLifeDays,
        location: editFood.location,
        quantity: editFood.quantity,
        unit: editFood.unit,
        photo: editFood.photo,
        emoji: editFood.emoji,
      });
      setPhotoPreview(editFood.photo);
    } else {
      setFormData(initialFormData);
      setPhotoPreview(undefined);
    }
  }, [editFood, isOpen]);

  const handlePresetSelect = (preset: FoodPreset) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      shelfLifeDays: preset.shelfLife,
      emoji: preset.emoji,
    }));
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, name }));
    const preset = findPresetByName(name);
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        shelfLifeDays: preset.shelfLife,
        emoji: preset.emoji,
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        compressImage(result, 800, 0.8).then((compressed) => {
          setPhotoPreview(compressed);
          setFormData((prev) => ({ ...prev, photo: compressed }));
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (
    base64: string,
    maxWidth: number,
    quality: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = base64;
    });
  };

  const removePhoto = () => {
    setPhotoPreview(undefined);
    setFormData((prev) => ({ ...prev, photo: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('请输入食材名称');
      return;
    }
    if (formData.shelfLifeDays <= 0) {
      alert('保质期天数必须大于0');
      return;
    }
    if (formData.quantity <= 0) {
      alert('数量必须大于0');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editFood) {
        updateFood(editFood.id, formData);
      } else {
        addFood(formData);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-scale-in"
        style={{
          animation: 'scaleIn 0.3s ease',
        }}
      >
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {editFood ? '✏️ 编辑食材' : '➕ 添加食材'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FoodPresetPicker
            onSelect={handlePresetSelect}
            selectedName={formData.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🍽️ 食材名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="输入食材名称，如：苹果、牛奶..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📅 购买/开封日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, purchaseDate: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ⏰ 保质期天数 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.shelfLifeDays}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shelfLifeDays: parseInt(e.target.value) || 0,
                  }))
                }
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📍 存放位置
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(locationNames) as StorageLocation[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, location: loc }))}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    formData.location === loc
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {locationNames[loc]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🔢 数量
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: parseFloat(e.target.value) || 0,
                  }))
                }
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📏 单位
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📷 照片（可选）
            </label>
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="预览"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                <Camera size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">点击上传照片</span>
                <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : editFood ? '保存修改' : '添加食材'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

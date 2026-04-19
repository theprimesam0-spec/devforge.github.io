export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  priceLabel: string;
  icon: string;
  category: 'digital' | 'local' | 'custom';
  features: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  paymentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  fileName?: string;
  fileType?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCardData {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  icon: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaAction: 'whatsapp' | 'upload' | 'contact' | 'payment';
}

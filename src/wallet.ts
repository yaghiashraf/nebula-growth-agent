import { logger } from '../lib/logger';
import type { WalletPassData } from '../types';

export class WalletGenerator {
  async generateAppleWalletPass(
    passData: {
      organizationName: string;
      description: string;
      logoText: string;
      primaryFields: Array<{ key: string; label: string; value: string }>;
      secondaryFields: Array<{ key: string; label: string; value: string }>;
      barcodeMessage: string;
      backgroundColor?: string;
      foregroundColor?: string;
      labelColor?: string;
    }
  ): Promise<WalletPassData> {
    try {
      const walletPass: WalletPassData = {
        formatVersion: 1,
        passTypeIdentifier: 'pass.com.nebula-growth-agent.loyalty',
        serialNumber: this.generateSerialNumber(),
        teamIdentifier: process.env.APPLE_TEAM_ID || 'TEAM123456',
        organizationName: passData.organizationName,
        description: passData.description,
        logoText: passData.logoText,
        backgroundColor: passData.backgroundColor || 'rgb(17, 24, 39)', // Dark mode base
        foregroundColor: passData.foregroundColor || 'rgb(249, 250, 251)', // Dark mode text
        labelColor: passData.labelColor || 'rgb(209, 213, 219)', // Dark mode secondary text
        generic: {
          primaryFields: passData.primaryFields,
          secondaryFields: passData.secondaryFields,
        },
        barcode: {
          message: passData.barcodeMessage,
          format: 'PKBarcodeFormatQR',
          messageEncoding: 'iso-8859-1',
        },
      };

      logger.info('Apple Wallet pass generated successfully', { 
        serialNumber: walletPass.serialNumber,
        organizationName: passData.organizationName,
      });

      return walletPass;
    } catch (error) {
      logger.error('Failed to generate Apple Wallet pass', { error });
      throw error;
    }
  }

  async generateGoogleWalletPass(
    passData: {
      issuerName: string;
      className: string;
      title: string;
      subtitle: string;
      description: string;
      barcodeValue: string;
      fields: Array<{ label: string; value: string }>;
      hexBackgroundColor?: string;
      logoImageUrl?: string;
    }
  ): Promise<object> {
    try {
      const googlePass = {
        iss: process.env.GOOGLE_WALLET_ISSUER_EMAIL || 'issuer@example.com',
        aud: 'google',
        typ: 'savetowallet',
        iat: Math.floor(Date.now() / 1000),
        payload: {
          loyaltyObjects: [
            {
              classId: `${process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000022'}.${passData.className}`,
              id: `${process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000022'}.${this.generateSerialNumber()}`,
              loyaltyClass: {
                issuerName: passData.issuerName,
                reviewStatus: 'UNDER_REVIEW',
                programName: passData.title,
                programLogo: passData.logoImageUrl ? {
                  sourceUri: {
                    uri: passData.logoImageUrl,
                  },
                } : undefined,
                hexBackgroundColor: passData.hexBackgroundColor || '#111827',
                locations: [],
              },
              state: 'ACTIVE',
              barcode: {
                type: 'QR_CODE',
                value: passData.barcodeValue,
              },
              textModulesData: passData.fields.map(field => ({
                header: field.label,
                body: field.value,
              })),
              linksModuleData: {
                uris: [
                  {
                    uri: 'https://nebula-growth-agent.com',
                    description: 'Nebula Growth Agent',
                  },
                ],
              },
            },
          ],
        },
      };

      logger.info('Google Wallet pass generated successfully', { 
        className: passData.className,
        issuerName: passData.issuerName,
      });

      return googlePass;
    } catch (error) {
      logger.error('Failed to generate Google Wallet pass', { error });
      throw error;
    }
  }

  async generateLoyaltyPass(
    ecommerceData: {
      storeName: string;
      customerName: string;
      customerEmail: string;
      pointsBalance: number;
      tierLevel: string;
      nextTierPoints: number;
      recentPurchases: Array<{ date: string; amount: number; description: string }>;
      specialOffers: Array<{ title: string; description: string; validUntil: string }>;
    }
  ): Promise<{ apple: WalletPassData; google: object }> {
    try {
      const serialNumber = this.generateSerialNumber();
      const barcodeMessage = `LOYALTY-${serialNumber}-${ecommerceData.customerEmail}`;

      // Generate Apple Wallet pass
      const applePass = await this.generateAppleWalletPass({
        organizationName: ecommerceData.storeName,
        description: `${ecommerceData.storeName} Loyalty Card`,
        logoText: ecommerceData.storeName,
        primaryFields: [
          {
            key: 'points',
            label: 'Points Balance',
            value: ecommerceData.pointsBalance.toString(),
          },
          {
            key: 'tier',
            label: 'Tier Level',
            value: ecommerceData.tierLevel,
          },
        ],
        secondaryFields: [
          {
            key: 'customer',
            label: 'Member',
            value: ecommerceData.customerName,
          },
          {
            key: 'nextTier',
            label: 'Points to Next Tier',
            value: ecommerceData.nextTierPoints.toString(),
          },
        ],
        barcodeMessage,
        backgroundColor: 'rgb(99, 102, 241)', // Indigo
        foregroundColor: 'rgb(255, 255, 255)',
        labelColor: 'rgb(199, 210, 254)',
      });

      // Generate Google Wallet pass
      const googlePass = await this.generateGoogleWalletPass({
        issuerName: ecommerceData.storeName,
        className: 'loyalty_card',
        title: `${ecommerceData.storeName} Loyalty`,
        subtitle: ecommerceData.tierLevel,
        description: `Loyalty card for ${ecommerceData.storeName}`,
        barcodeValue: barcodeMessage,
        fields: [
          { label: 'Points Balance', value: ecommerceData.pointsBalance.toString() },
          { label: 'Tier Level', value: ecommerceData.tierLevel },
          { label: 'Member', value: ecommerceData.customerName },
          { label: 'Points to Next Tier', value: ecommerceData.nextTierPoints.toString() },
        ],
        hexBackgroundColor: '#6366f1',
      });

      return { apple: applePass, google: googlePass };
    } catch (error) {
      logger.error('Failed to generate loyalty pass', { error });
      throw error;
    }
  }

  async generateEventPass(
    eventData: {
      eventName: string;
      eventDate: string;
      eventTime: string;
      venueName: string;
      venueAddress: string;
      attendeeName: string;
      ticketType: string;
      seatNumber?: string;
      eventDescription: string;
      organizerName: string;
    }
  ): Promise<{ apple: WalletPassData; google: object }> {
    try {
      const serialNumber = this.generateSerialNumber();
      const barcodeMessage = `EVENT-${serialNumber}-${eventData.attendeeName}`;

      // Generate Apple Wallet pass
      const applePass = await this.generateAppleWalletPass({
        organizationName: eventData.organizerName,
        description: `${eventData.eventName} Ticket`,
        logoText: eventData.eventName,
        primaryFields: [
          {
            key: 'event',
            label: 'Event',
            value: eventData.eventName,
          },
          {
            key: 'date',
            label: 'Date',
            value: eventData.eventDate,
          },
        ],
        secondaryFields: [
          {
            key: 'time',
            label: 'Time',
            value: eventData.eventTime,
          },
          {
            key: 'venue',
            label: 'Venue',
            value: eventData.venueName,
          },
          {
            key: 'attendee',
            label: 'Attendee',
            value: eventData.attendeeName,
          },
          ...(eventData.seatNumber ? [{
            key: 'seat',
            label: 'Seat',
            value: eventData.seatNumber,
          }] : []),
        ],
        barcodeMessage,
        backgroundColor: 'rgb(139, 92, 246)', // Violet
        foregroundColor: 'rgb(255, 255, 255)',
        labelColor: 'rgb(221, 214, 254)',
      });

      // Generate Google Wallet pass
      const googlePass = await this.generateGoogleWalletPass({
        issuerName: eventData.organizerName,
        className: 'event_ticket',
        title: eventData.eventName,
        subtitle: `${eventData.eventDate} at ${eventData.eventTime}`,
        description: eventData.eventDescription,
        barcodeValue: barcodeMessage,
        fields: [
          { label: 'Event', value: eventData.eventName },
          { label: 'Date', value: eventData.eventDate },
          { label: 'Time', value: eventData.eventTime },
          { label: 'Venue', value: eventData.venueName },
          { label: 'Attendee', value: eventData.attendeeName },
          ...(eventData.seatNumber ? [{ label: 'Seat', value: eventData.seatNumber }] : []),
        ],
        hexBackgroundColor: '#8b5cf6',
      });

      return { apple: applePass, google: googlePass };
    } catch (error) {
      logger.error('Failed to generate event pass', { error });
      throw error;
    }
  }

  async generateCouponPass(
    couponData: {
      storeName: string;
      couponTitle: string;
      discountAmount: string;
      discountDescription: string;
      validUntil: string;
      couponCode: string;
      termsAndConditions: string;
      minimumPurchase?: string;
    }
  ): Promise<{ apple: WalletPassData; google: object }> {
    try {
      const serialNumber = this.generateSerialNumber();
      const barcodeMessage = `COUPON-${couponData.couponCode}-${serialNumber}`;

      // Generate Apple Wallet pass
      const applePass = await this.generateAppleWalletPass({
        organizationName: couponData.storeName,
        description: `${couponData.storeName} Coupon`,
        logoText: couponData.storeName,
        primaryFields: [
          {
            key: 'discount',
            label: 'Discount',
            value: couponData.discountAmount,
          },
          {
            key: 'code',
            label: 'Code',
            value: couponData.couponCode,
          },
        ],
        secondaryFields: [
          {
            key: 'title',
            label: 'Offer',
            value: couponData.couponTitle,
          },
          {
            key: 'validUntil',
            label: 'Valid Until',
            value: couponData.validUntil,
          },
          ...(couponData.minimumPurchase ? [{
            key: 'minimum',
            label: 'Minimum Purchase',
            value: couponData.minimumPurchase,
          }] : []),
        ],
        barcodeMessage,
        backgroundColor: 'rgb(16, 185, 129)', // Emerald
        foregroundColor: 'rgb(255, 255, 255)',
        labelColor: 'rgb(167, 243, 208)',
      });

      // Generate Google Wallet pass
      const googlePass = await this.generateGoogleWalletPass({
        issuerName: couponData.storeName,
        className: 'coupon_offer',
        title: couponData.couponTitle,
        subtitle: `${couponData.discountAmount} off`,
        description: couponData.discountDescription,
        barcodeValue: barcodeMessage,
        fields: [
          { label: 'Discount', value: couponData.discountAmount },
          { label: 'Code', value: couponData.couponCode },
          { label: 'Valid Until', value: couponData.validUntil },
          ...(couponData.minimumPurchase ? [{ label: 'Minimum Purchase', value: couponData.minimumPurchase }] : []),
        ],
        hexBackgroundColor: '#10b981',
      });

      return { apple: applePass, google: googlePass };
    } catch (error) {
      logger.error('Failed to generate coupon pass', { error });
      throw error;
    }
  }

  private generateSerialNumber(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async optimizeImages(
    images: Array<{ url: string; alt: string; context: string }>,
    targetFormat: 'webp' | 'avif' | 'jpeg' = 'webp',
    quality: number = 85
  ): Promise<Array<{ 
    originalUrl: string; 
    optimizedUrl: string; 
    alt: string; 
    sizeReduction: number; 
    format: string; 
  }>> {
    try {
      const optimizedImages = await Promise.all(
        images.map(async (image) => {
          // This is a mock implementation
          // In production, you would use actual image optimization service
          const mockOptimization = {
            originalUrl: image.url,
            optimizedUrl: image.url.replace(/\.(jpg|jpeg|png)$/i, `.${targetFormat}`),
            alt: image.alt || this.generateAltText(image.url, image.context),
            sizeReduction: Math.random() * 0.6 + 0.2, // 20-80% reduction
            format: targetFormat,
          };

          return mockOptimization;
        })
      );

      logger.info('Images optimized successfully', { 
        count: optimizedImages.length,
        averageReduction: optimizedImages.reduce((sum, img) => sum + img.sizeReduction, 0) / optimizedImages.length,
      });

      return optimizedImages;
    } catch (error) {
      logger.error('Failed to optimize images', { error });
      return [];
    }
  }

  private generateAltText(imageUrl: string, context: string): string {
    // Simple alt text generation based on URL and context
    const filename = imageUrl.split('/').pop()?.split('.')[0] || 'image';
    const contextWords = context.toLowerCase().split(' ').slice(0, 5).join(' ');
    
    return `${filename} ${contextWords}`.trim();
  }

  async generateAssetManifest(
    assets: Array<{
      type: 'wallet-pass' | 'optimized-image' | 'schema' | 'content';
      name: string;
      data: any;
      metadata?: Record<string, any>;
    }>
  ): Promise<{
    version: string;
    timestamp: string;
    assets: Array<{
      id: string;
      type: string;
      name: string;
      checksum: string;
      size: number;
      metadata: Record<string, any>;
    }>;
  }> {
    try {
      const manifest = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        assets: assets.map(asset => ({
          id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: asset.type,
          name: asset.name,
          checksum: this.generateChecksum(JSON.stringify(asset.data)),
          size: JSON.stringify(asset.data).length,
          metadata: asset.metadata || {},
        })),
      };

      logger.info('Asset manifest generated', { 
        assetCount: assets.length,
        version: manifest.version,
      });

      return manifest;
    } catch (error) {
      logger.error('Failed to generate asset manifest', { error });
      throw error;
    }
  }

  private generateChecksum(content: string): string {
    // Simple checksum generation
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

export default WalletGenerator;
import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useIsDark } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  position?: 'center' | 'bottom' | 'top';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  position = 'center',
  showCloseButton = true,
  closeOnBackdrop = true,
  style,
  contentStyle,
  titleStyle,
}) => {
  const isDark = useIsDark();
  const { t } = useTranslation();

  const colors = {
    background: isDark ? '#1c1c1e' : '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    text: isDark ? '#ffffff' : '#000000',
    border: isDark ? '#38383a' : '#e5e5ea',
    closeButton: isDark ? '#8e8e93' : '#6d6d70',
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          width: screenWidth * 0.8,
          maxHeight: screenHeight * 0.4,
        };
      case 'medium':
        return {
          width: screenWidth * 0.9,
          maxHeight: screenHeight * 0.6,
        };
      case 'large':
        return {
          width: screenWidth * 0.95,
          maxHeight: screenHeight * 0.8,
        };
      case 'fullscreen':
        return {
          width: screenWidth,
          height: screenHeight,
        };
      default:
        return {
          width: screenWidth * 0.9,
          maxHeight: screenHeight * 0.6,
        };
    }
  };

  const getPositionStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      backgroundColor: colors.overlay,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          justifyContent: 'flex-start',
          paddingTop: 50,
        };
      case 'bottom':
        return {
          ...baseStyle,
          justifyContent: 'flex-end',
        };
      case 'center':
      default:
        return {
          ...baseStyle,
          justifyContent: 'center',
          alignItems: 'center',
        };
    }
  };

  const getContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.background,
      borderRadius: size === 'fullscreen' ? 0 : 16,
      padding: 20,
      ...getSizeStyle(),
    };

    if (position === 'bottom') {
      return {
        ...baseStyle,
        borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
        width: screenWidth,
      };
    }

    return baseStyle;
  };

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={position === 'bottom' ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[getPositionStyle(), style]}>
          <TouchableWithoutFeedback>
            <View style={[getContentStyle(), contentStyle]}>
              {/* Header */}
              {(title || showCloseButton) && (
                <View style={styles.header}>
                  {title && (
                    <Text style={[styles.title, { color: colors.text }, titleStyle]}>
                      {title}
                    </Text>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={onClose}
                    >
                      <Text style={[styles.closeButtonText, { color: colors.closeButton }]}>
                        ✕
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Content */}
              <View style={styles.content}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5ea',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginStart: 12,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
});

export default Modal;
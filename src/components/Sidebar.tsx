import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { staticData } from '../utils/staticData';
import { ROUTES } from '../utils/routes';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  roles?: string[];
  children?: MenuItem[];
}

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = screenWidth * 0.8;

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { staff, logout } = useAuthStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [slideAnim] = useState(new Animated.Value(-SIDEBAR_WIDTH));

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await staticData.getMenuItems(staff?.role);
        setMenuItems(items);
      } catch (error) {
        console.error('Failed to load menu items:', error);
      }
    };

    if (visible) {
      loadMenuItems();
    }
  }, [visible, staff?.role]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const toggleSubmenu = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // If item has children, toggle submenu
      toggleSubmenu(item.id);
    } else if (item.route) {
      // If item has a route, navigate to it
      onClose();
      setTimeout(() => {
        router.push(item.route as any);
      }, 100);
    }
  };

  const handleLogout = async () => {
    onClose();
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        try {
          await logout();
          router.replace(ROUTES.ROOT);
        } catch (error) {
          console.error('Logout error:', error);
          router.replace(ROUTES.ROOT);
        }
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
                router.replace(ROUTES.ROOT);
              } catch (error) {
                console.error('Logout error:', error);
                router.replace(ROUTES.ROOT);
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.sidebar,
            { 
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#4A90E2" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {staff?.fullName || staff?.username || 'User'}
                </Text>
                <Text style={styles.userRole}>{staff?.role || 'Staff'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6C757D" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.has(item.id);
              
              return (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuItemPress(item)}
                  >
                    <Ionicons 
                      name={item.icon as any} 
                      size={24} 
                      color="#4A90E2" 
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuText}>{item.title}</Text>
                    {hasChildren ? (
                      <Ionicons 
                        name={isExpanded ? "chevron-down" : "chevron-forward"} 
                        size={20} 
                        color="#6C757D" 
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#6C757D" />
                    )}
                  </TouchableOpacity>
                  
                  {/* Submenu Items */}
                  {hasChildren && isExpanded && (
                    <View style={styles.submenuContainer}>
                      {item.children!.map((childItem) => (
                        <TouchableOpacity
                          key={childItem.id}
                          style={styles.submenuItem}
                          onPress={() => {
                            if (childItem.route) {
                              onClose();
                              setTimeout(() => {
                                router.push(childItem.route as any);
                              }, 100);
                            }
                          }}
                        >
                          <Ionicons 
                            name={childItem.icon as any} 
                            size={20} 
                            color="#6C757D" 
                            style={styles.submenuIcon}
                          />
                          <Text style={styles.submenuText}>{childItem.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    zIndex: 0
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position:'absolute',
    zIndex:-1,
    width: "100%",
    height:"100%"
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#6C757D',
    textTransform: 'capitalize',
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '500',
  },
  submenuContainer: {
    backgroundColor: '#F8F9FA',
    paddingLeft: 20,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingLeft: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  submenuIcon: {
    marginRight: 12,
    width: 20,
  },
  submenuText: {
    flex: 1,
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '400',
  },
});
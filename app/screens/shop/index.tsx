import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {ImageBackground} from 'expo-image';
import {useRouter, useFocusEffect} from 'expo-router';

import {images, SHOP_CATALOG, getUpgradeCost, UpgradeDef} from '@/constants';
import {
  ShopState,
  loadShopState,
  purchaseUpgradeById,
  ShopPurchaseResult,
} from '@/state/meta/shop';

import styles from './styles';

const Shop = () => {
  const router = useRouter();
  const [shopState, setShopState] = useState<ShopState | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const walletCredits = shopState?.wallet.oxygenCredits || 0;

  const refreshShopState = async () => {
    const loaded = await loadShopState();
    setShopState(loaded);
  };

  useEffect(() => {
    refreshShopState();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshShopState();
    }, []),
  );

  const onPurchase = async (upgrade: UpgradeDef) => {
    if (loading) return;

    setLoading(true);
    setStatusMessage('');

    try {
      const result = await purchaseUpgradeById(upgrade.id);
      setShopState(result.shopState);

      if (result.ok) {
        setStatusMessage(`${upgrade.label} upgraded!`);
      } else {
        const messageByReason: Record<NonNullable<ShopPurchaseResult['reason']>, string> = {
          upgrade_not_found: 'Upgrade not found.',
          max_level: 'Already at max level.',
          insufficient_credits: `Need ${result.cost || 0} credits.`,
        };

        setStatusMessage(
          result.reason ? messageByReason[result.reason] : 'Purchase failed.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const upgradeRows = useMemo(() => {
    if (!shopState) return [];

    return SHOP_CATALOG.map(upgrade => {
      const currentLevel = shopState.levels[upgrade.id] || 0;
      const atMaxLevel = currentLevel >= upgrade.maxLevel;
      const nextCost = atMaxLevel ? 0 : getUpgradeCost(upgrade, currentLevel);
      const canAfford = !atMaxLevel && walletCredits >= nextCost;

      return {
        ...upgrade,
        currentLevel,
        atMaxLevel,
        nextCost,
        canAfford,
      };
    });
  }, [shopState, walletCredits]);

  return (
    <ImageBackground source={images.space} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.topLeftBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <ImageBackground
              style={styles.backButton}
              resizeMode="stretch"
              source={images.normalButton}>
              <Text style={styles.buttonText}>Back</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <ImageBackground
          resizeMode="stretch"
          source={images.panelHeader}
          style={styles.headerPanel}>
          <Text style={styles.headerText}>Shop</Text>
        </ImageBackground>

        <ImageBackground
          style={styles.walletPanel}
          resizeMode="stretch"
          source={images.panel}>
          <Text style={styles.walletTitle}>Wallet</Text>
          <Text style={styles.walletValue}>{walletCredits} credits</Text>
          {!!statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}
        </ImageBackground>

        <FlatList
          data={upgradeRows}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({item}) => (
            <View style={styles.cardWrapper}>
              <ImageBackground
                style={styles.card}
                resizeMode="stretch"
                source={images.panel}>
                <View>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>

                <View>
                  <Text style={styles.cardMeta}>
                    Lvl {item.currentLevel}/{item.maxLevel}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {item.atMaxLevel ? 'MAXED' : `Cost: ${item.nextCost}`}
                  </Text>

                  <TouchableOpacity
                    onPress={() => onPurchase(item)}
                    disabled={loading || item.atMaxLevel || !item.canAfford}>
                    <ImageBackground
                      style={[
                        styles.buyButton,
                        (loading || item.atMaxLevel || !item.canAfford) &&
                          styles.disabledBuyButton,
                      ]}
                      resizeMode="stretch"
                      source={images.normalButton}>
                      <Text style={styles.buttonText}>
                        {item.atMaxLevel
                          ? 'MAX'
                          : item.canAfford
                            ? 'UPGRADE'
                            : 'LOCKED'}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Shop;

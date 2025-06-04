import React, {useCallback, useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';

import FireSvg from '@/assets/images/fire.svg';
import Loading from '@/components/Loading';
import {useAuth} from '@/contexts/AuthContext';
import {useRefresh} from '@/contexts/RefreshContext';
import {useTheme} from '@/contexts/ThemeContext';
import {calcPer, sumArr} from '@/lib/sol';
import {getPureStudyArr, getTotalStudyArr} from '@/lib/weekDataHandler';

const ProfileCard = () => {
  const {user} = useAuth();
  const {theme, typography} = useTheme();
  const {refreshTrigger} = useRefresh();

  const [weeklyStudiedHour, setStudiedHour] = useState(0);
  const [weeklyTotalHour, setTotalHour] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setStudiedHour(sumArr(await getPureStudyArr(user.uid, 0)));
      setTotalHour(sumArr(await getTotalStudyArr(user.uid, 0)));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  return (
    <View style={{backgroundColor: theme.card, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 12}}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Image source={require('@/assets/images/rock.png')} style={{width: 64, height: 64}} />
          <View style={{flexShrink: 1}}>
            <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>{user?.displayName}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={[typography.body, {color: theme.red, fontWeight: '600'}]}>평균 집중도 {calcPer(weeklyTotalHour, weeklyStudiedHour)}%</Text>
              <FireSvg width={16} height={16} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ProfileCard;

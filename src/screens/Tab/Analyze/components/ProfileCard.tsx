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
      const pureStudyData = await getPureStudyArr(user.uid, 0);
      const totalStudyData = await getTotalStudyArr(user.uid, 0);

      setStudiedHour(sumArr(pureStudyData));
      setTotalHour(sumArr(totalStudyData));
      console.log(weeklyStudiedHour);
      console.log(weeklyTotalHour);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // 주간 평균 집중도 계산
  const weeklyConcentration = weeklyTotalHour > 0 ? calcPer(weeklyTotalHour, weeklyStudiedHour) : 0;

  return (
    <View style={{backgroundColor: theme.card, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 12}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loading fullScreen={false} />
        </View>
      ) : (
        <>
          <Image source={require('@/assets/images/rock.png')} style={{width: 64, height: 64}} />
          <View style={{flexShrink: 1}}>
            <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>{user?.displayName}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={[typography.body, {color: theme.red, fontWeight: '600'}]}>주간 평균 집중도 {weeklyConcentration}%</Text>
              <FireSvg width={16} height={16} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ProfileCard;

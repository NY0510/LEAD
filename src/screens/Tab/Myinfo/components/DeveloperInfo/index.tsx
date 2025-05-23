import {API_BASE_URL} from '@env';
import React from 'react';
import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Card from '@/components/Card';
import {useTheme} from '@/contexts/ThemeContext';
import {toDP} from '@/theme/typography';

const DeveloperCard = ({name, roles, profileImage, url}: {name: string; roles: string[]; profileImage?: string; url: string}) => {
  const {theme, typography} = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.65} onPress={() => Linking.openURL(url)}>
      <View style={{flexDirection: 'row', alignContent: 'center', gap: 10}}>
        <Image source={{uri: profileImage, cache: 'force-cache'}} borderRadius={48 / 2} style={{width: 48, height: 48, backgroundColor: theme.border, borderRadius: 48 / 2}} />
        <View style={{justifyContent: 'center', gap: 4}}>
          <Text style={[typography.body, {color: theme.text, fontWeight: '600'}]}>{name}</Text>
          <Text style={[typography.body, {color: theme.secondary, fontSize: toDP(14)}]}>{roles.join(', ')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DeveloperCardList = ({title, developers}: {title: string; developers: {name: string; roles: string[]; profileImage?: string; url: string}[]}) => {
  const {typography} = useTheme();

  return (
    <Card title={title} titleStyle={{fontSize: toDP(Number(typography.body.fontSize))}}>
      <View style={{gap: 16, marginTop: 8}}>
        {developers.map((developer, index) => (
          <DeveloperCard key={index} {...developer} />
        ))}
      </View>
    </Card>
  );
};

const DeveloperInfo = () => {
  const members = [
    {name: '김가온', roles: ['Frontend', 'Backend', 'UI/UX Design'], profileImage: `${API_BASE_URL}/public/ny64.png`, url: 'https://ny64.kr'},
    {name: '김성태', roles: ['Frontend'], profileImage: `${API_BASE_URL}/public/ainnot.png`, url: 'https://github.com/ainnot'},
    {name: '김정준', roles: ['AI Model, UI/UX Design'], profileImage: `${API_BASE_URL}/public/ba.png`, url: 'https://github.com/Shibodog'},
    {name: '김태경', roles: ['AI Model, UI/UX Design'], profileImage: `${API_BASE_URL}/public/croco.png`, url: 'https://github.com/greatlights'},
  ];

  return (
    <ScrollView contentContainerStyle={{padding: toDP(18), gap: 8}} showsVerticalScrollIndicator={false}>
      <DeveloperCardList title="LEAD 개발진" developers={members} />
    </ScrollView>
  );
};

export default DeveloperInfo;

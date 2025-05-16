import {API_BASE_URL} from '@env';
import React from 'react';
import {ImageBackground, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Card from '@/components/Card';
import {useTheme} from '@/contexts/ThemeContext';
import {toDP} from '@/theme/typography';

const DeveloperCard = ({name, roles, profileImage}: {name: string; roles: string[]; profileImage?: string}) => {
  const {theme, typography} = useTheme();

  return (
    <View style={{flexDirection: 'row', alignContent: 'center', gap: 10}}>
      <ImageBackground src={profileImage} style={{width: 48, height: 48, backgroundColor: theme.border, borderRadius: 48 / 2}} />
      <View style={{justifyContent: 'center', gap: 4}}>
        <Text style={[typography.body, {color: theme.text, fontWeight: '600'}]}>{name}</Text>
        <Text style={[typography.body, {color: theme.secondary, fontSize: toDP(14)}]}>{roles.join(', ')}</Text>
      </View>
    </View>
  );
};

const DeveloperCardList = ({title, developers}: {title: string; developers: {name: string; roles: string[]; profileImage?: string}[]}) => {
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
    {name: '김가온', roles: ['Frontend', 'Backend', 'UI / UX Design'], profileImage: `${API_BASE_URL}/public/ny64.png`},
    {name: '김성태', roles: ['Frontend'], profileImage: `${API_BASE_URL}/public/ainnot.png`},
    {name: '김정준', roles: ['AI, UI / UX Design'], profileImage: `${API_BASE_URL}/public/ainnot.png`},
    {name: '김태경', roles: ['AI, UI / UX Design'], profileImage: `${API_BASE_URL}/public/ainnot.png`},
  ];

  return (
    <ScrollView contentContainerStyle={{padding: toDP(18), gap: 8}} showsVerticalScrollIndicator={false}>
      <DeveloperCardList title="LEAD 개발진" developers={members} />
    </ScrollView>
  );
};

export default DeveloperInfo;

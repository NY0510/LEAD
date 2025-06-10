import React, {Fragment, useCallback, useRef, useState} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import ImagePicker, {type Image as ImageType, PickerErrorCode} from 'react-native-image-crop-picker';

import {createStudyRoom} from '@/api/apiRouter';
import {CustomBottomSheet, CustomBottomSheetView} from '@/components/CustomBottomSheet';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {closeBottomSheet, openBottomSheet} from '@/lib/bottomSheetUtils';
import {showToast} from '@/lib/toast';
import {RootStackParamList} from '@/navigations/RootStacks';
import BottomSheet from '@gorhom/bottom-sheet';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

const StudyRoomCreate = () => {
  const rootStackNavigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {theme, typography} = useTheme();
  const {user} = useAuth();

  const [image, setImage] = useState<ImageType | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const nameTextInputRef = useRef<TextInput | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

  const selectPhoto = async (openCamera = false) => {
    let _image: ImageType | null = null;

    try {
      if (openCamera) {
        _image = await ImagePicker.openCamera({
          // compressImageMaxWidth: 512,
          // compressImageMaxHeight: 512,
          cropping: true,
          forceJpg: true,
          compressImageQuality: 1,
          enableRotationGesture: true,
          mediaType: 'photo',
          includeBase64: true,
          writeTempFile: true,
        });
      } else {
        _image = await ImagePicker.openPicker({
          // compressImageMaxWidth: 512,
          // compressImageMaxHeight: 512,
          freeStyleCropEnabled: true,
          compressImageQuality: 1,
          cropping: true,
          forceJpg: true,
          enableRotationGesture: true,
          mediaType: 'photo',
          includeBase64: true,
          writeTempFile: true,
        });
      }

      if (_image.size > MAX_IMAGE_SIZE) {
        return showToast('이미지 크기가 너무 커요. (최대 3MB)');
      }
      setImage(_image);
      closeBottomSheet(bottomSheetRef);
    } catch (e: any) {
      const errorCode: PickerErrorCode = e.code;
      switch (errorCode) {
        case 'E_PICKER_CANCELLED':
          break;
        case 'E_NO_LIBRARY_PERMISSION':
          showToast('사진 앨범 접근 권한이 없어요.');
          break;
        default:
          showToast(`사진 선택에 실패했어요:\n${e.message}`);
          break;
      }
    }
  };

  const _createStudyRoom = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      await createStudyRoom(user.uid, name, image ? `data:${image?.mime};base64,${image?.data}` : '', description);
      showToast('공부방이 생성되었어요.');
      rootStackNavigation.goBack();
    } catch (e) {
      showToast(`공부방 생성에 실패했어요.\n${(e as Error).message}`);
    }
  }, [user, name, description, image, rootStackNavigation]);

  return (
    <Fragment>
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{padding: 18, flexGrow: 1}}>
          <View style={{gap: 24, flex: 1, alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={0.65} onPress={() => openBottomSheet(bottomSheetRef)}>
              <Image source={image ? {uri: image.path.startsWith('file://') ? image.path : `file://${image.path}`} : require('@/assets/images/studyroom_default.jpg')} style={{aspectRatio: 16 / 9, borderRadius: 12, maxHeight: 250, maxWidth: '100%', width: '100%'}} resizeMode="cover" />
              <FontAwesome6 name="camera" iconStyle="solid" size={20} color="#fff" style={{position: 'absolute', padding: 10, borderRadius: 99, bottom: 10, right: 10, backgroundColor: `${theme.text}99`}} />
            </TouchableOpacity>

            <View style={{gap: 8, width: '100%'}}>
              <View style={{backgroundColor: theme.card, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12}}>
                <TextInput ref={nameTextInputRef} placeholder="공부방 이름 (필수)" style={[typography.body, {flex: 1, color: theme.text, padding: 0, margin: 0}]} textAlignVertical="top" maxLength={30} value={name} onChangeText={setName} />
                <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center'}}>
                  {name.length > 0 && (
                    <TouchableOpacity activeOpacity={0.65} onPress={() => setName('')}>
                      <FontAwesome6 name="circle-xmark" iconStyle="solid" size={18} color={theme.secondary} />
                    </TouchableOpacity>
                  )}
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[typography.baseTextStyle, {color: theme.text}]}>{name.length}</Text>
                    <Text style={[typography.baseTextStyle, {color: theme.secondary}]}>/30</Text>
                  </View>
                </View>
              </View>

              <View style={{backgroundColor: theme.card, borderRadius: 8, flexDirection: 'row', alignItems: 'flex-end', gap: 12, padding: 12}}>
                <TextInput ref={nameTextInputRef} placeholder="설명" style={[typography.body, {flex: 1, minHeight: 80, color: theme.text, padding: 0, margin: 0}]} textAlignVertical="top" maxLength={50} multiline value={description} onChangeText={setDescription} />
                <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[typography.baseTextStyle, {color: theme.text}]}>{description.length}</Text>
                    <Text style={[typography.baseTextStyle, {color: theme.secondary}]}>/50</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          disabled={!(name && description)}
          activeOpacity={0.65}
          onPress={() => {
            _createStudyRoom();
          }}
          style={{
            backgroundColor: name && description ? theme.primary : theme.secondary,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 18,
          }}>
          <Text style={[typography.body, {color: theme.card}]}>공부방 만들기</Text>
        </TouchableOpacity>
      </View>

      <CustomBottomSheet ref={bottomSheetRef} handleComponent={null}>
        <CustomBottomSheetView>
          <View style={{gap: 14}}>
            <TouchableOpacity activeOpacity={0.65} onPress={() => selectPhoto(false)}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="image" iconStyle="solid" size={16} color={theme.text} style={{minWidth: 20}} />
                <Text style={[typography.body, {color: theme.text}]}>사진 선택</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 1, backgroundColor: theme.border}} />
            <TouchableOpacity activeOpacity={0.65} onPress={() => selectPhoto(true)}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="camera" iconStyle="solid" size={16} color={theme.text} style={{minWidth: 20}} />
                <Text style={[typography.body, {color: theme.text}]}>사진 촬영</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 1, backgroundColor: theme.border}} />
            <TouchableOpacity
              activeOpacity={0.65}
              onPress={() => {
                setImage(null);
                closeBottomSheet(bottomSheetRef);
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="trash" iconStyle="solid" size={16} color={theme.text} style={{minWidth: 20}} />
                <Text style={[typography.body, {color: theme.text}]}>기본 사진으로 변경</Text>
              </View>
            </TouchableOpacity>
          </View>
        </CustomBottomSheetView>
      </CustomBottomSheet>
    </Fragment>
  );
};

export default StudyRoomCreate;

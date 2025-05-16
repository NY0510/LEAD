import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  rootContainer: {
    gap: 22,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTextContainer: {
    flexWrap: 'wrap',
  },
  headerTitle: {
    fontWeight: '600',
  },
  headerSubtitle: {},
  headerAvatar: {
    width: 64,
    height: 64,
  },
  memoButton: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  memoArrowIndicator: {
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: -20,
    right: 20,
  },
  memoLabel: {
    fontWeight: '600',
    flexShrink: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studyTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studyTimeValue: {
    fontWeight: '600',
  },
  studyTimeGoal: {
    fontWeight: '600',
  },
  startStudyButton: {
    aspectRatio: 1,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  studyRoomList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  studyRoomItem: {
    flexGrow: 1,
  },
  studyRoomContent: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  studyRoomLabel: {
    fontWeight: '600',
  },
  bottomSheetContainer: {
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  bottomSheetHeader: {
    fontWeight: '700',
    fontSize: 20,
  },
  bottomSheetSubtitle: {
    fontWeight: '400',
    fontSize: 16,
  },
  timerPickerContainer: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveActionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  saveActionLabel: {
    fontWeight: '600',
  },
  todayStudyContainer: {
    gap: 8,
  },
  todayStudyLegendList: {
    flexDirection: 'row',
    gap: 12,
  },
  todayStudyLegendItemPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todayStudyLegendCirclePrimary: {
    width: 15,
    height: 15,
    borderColor: '#344BFD',
    borderWidth: 3,
    borderRadius: 7.5,
  },
  todayStudyLegendItemSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todayStudyLegendCircleSecondary: {
    width: 15,
    height: 15,
    borderColor: '#EE902C',
    borderWidth: 3,
    borderRadius: 7.5,
  },
});

export default styles;

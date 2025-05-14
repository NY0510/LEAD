import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    gap: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTextWrap: {
    flexWrap: 'wrap',
  },
  headerName: {
    fontWeight: '600',
  },
  headerSub: {},
  headerImage: {
    width: 64,
    height: 64,
  },
  memoTouchable: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  memoArrow: {
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: -20,
    right: 20,
  },
  memoText: {
    fontWeight: '600',
    flexShrink: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studyTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studyTimeText: {
    fontWeight: '600',
  },
  studyTimeSub: {
    fontWeight: '600',
  },
  playButton: {
    aspectRatio: 1,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  studyRoomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  studyRoomButton: {
    flexGrow: 1,
  },
  studyRoomInner: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  studyRoomText: {
    fontWeight: '600',
  },
  bottomSheetContent: {
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  bottomSheetTitle: {
    fontWeight: '700',
    alignSelf: 'flex-start',
    fontSize: 20,
    marginBottom: 8,
  },
  timerPickerWrap: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: '600',
  },
  todayStudyWrap: {
    gap: 8,
  },
  todayStudyLegendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  todayStudyLegendItemBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todayStudyLegendCircleBlue: {
    width: 15,
    height: 15,
    borderColor: '#344BFD',
    borderWidth: 3,
    borderRadius: 7.5,
  },
  todayStudyLegendItemOrange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todayStudyLegendCircleOrange: {
    width: 15,
    height: 15,
    borderColor: '#EE902C',
    borderWidth: 3,
    borderRadius: 7.5,
  },
});

export default styles;

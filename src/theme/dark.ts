import Palette from '@/theme/types/Palette';

const dark: Palette = {
  background: '#0F1419', // 깊은 다크 블루-그레이 배경
  primary: '#4A9EFF', // 라이트 테마의 primary보다 밝고 부드러운 블루
  secondary: '#A8B3BA', // 중간 톤의 그레이 (텍스트 가독성 고려)
  inactive: '#4A5568', // 비활성화된 요소용 어두운 그레이
  text: '#F7FAFC', // 거의 흰색에 가까운 밝은 텍스트
  card: '#1A202C', // 카드 배경용 살짝 밝은 다크 톤
  border: '#2D3748', // 경계선용 중간 다크 톤
  shadow: '#000000', // 그림자용 순수 검정
  red: '#FF6B6B', // 에러/경고용 부드러운 빨강
};

export default dark;

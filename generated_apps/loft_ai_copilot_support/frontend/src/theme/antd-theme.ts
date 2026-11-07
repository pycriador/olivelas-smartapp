import type { ThemeConfig } from 'antd';
import { colors } from './colors';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorPrimaryHover: colors.primaryHover,
    colorPrimaryActive: colors.primaryActive,
    colorPrimaryBg: colors.primaryBg,
    colorPrimaryBorder: colors.primaryBorder,

    colorText: colors.neutralDark,
    colorTextSecondary: colors.neutralMuted,
    colorBorder: colors.neutralBorder,
    colorBorderSecondary: '#EEF2F6',
    colorBgLayout: colors.neutralBg,
    colorBgContainer: colors.neutralSurface,

    colorSuccess: colors.success,
    colorSuccessBg: colors.successBg,
    colorSuccessBorder: colors.successBorder,

    colorWarning: colors.warning,
    colorWarningBg: colors.warningBg,
    colorWarningBorder: colors.warningBorder,

    colorError: colors.error,
    colorErrorBg: colors.errorBg,
    colorErrorBorder: colors.errorBorder,

    colorInfo: colors.info,
    colorInfoBg: colors.infoBg,
    colorInfoBorder: colors.infoBorder,

    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,

    controlHeight: 38,
    controlHeightLG: 44,
    controlHeightSM: 30,
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      fontWeight: 600,
      borderRadius: 8,
      controlHeight: 38,
      defaultBorderColor: colors.neutralBorder,
      defaultColor: colors.neutralDark,
      defaultGhostBorderColor: colors.neutralBorder,
    },
    Card: {
      borderRadiusLG: 12,
      colorBorderSecondary: colors.neutralBorder,
      boxShadowSecondary: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
      headerFontSize: 16,
    },
    Table: {
      headerBg: '#FAFBFD',
      headerColor: colors.neutralMuted,
      headerSplitColor: 'transparent',
      borderColor: colors.neutralBorder,
      rowHoverBg: '#FFF9F6',
      borderRadius: 12,
    },
    Modal: {
      borderRadiusLG: 12,
      headerBg: colors.neutralSurface,
      titleFontSize: 18,
    },
    Tag: {
      borderRadiusSM: 4,
      defaultBg: '#F0F4F8',
      defaultColor: '#334E68',
    },
    Tabs: {
      itemSelectedColor: colors.primary,
      itemHoverColor: colors.primaryHover,
      inkBarColor: colors.primary,
      titleFontSize: 14,
    },
    Input: {
      borderRadius: 8,
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.primaryBorder,
    },
    Select: {
      borderRadius: 8,
    },
    Menu: {
      itemSelectedBg: colors.primaryBg,
      itemSelectedColor: colors.primary,
      itemHoverBg: '#F8FAFC',
      itemHoverColor: colors.neutralDark,
      itemBorderRadius: 6,
    },
  },
};

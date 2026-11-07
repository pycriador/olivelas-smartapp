import type { ThemeConfig } from 'antd';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

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

    fontFamily: typography.fontFamily,
    fontSize: typography.fontSizeBase,
    borderRadius: spacing.borderRadiusBase,
    borderRadiusLG: spacing.borderRadiusLg,
    borderRadiusSM: spacing.borderRadiusSm,

    controlHeight: 38,
    controlHeightLG: 44,
    controlHeightSM: 30,
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      fontWeight: 600,
      borderRadius: spacing.borderRadiusBase,
      controlHeight: 38,
      defaultBorderColor: colors.neutralBorder,
      defaultColor: colors.neutralDark,
      defaultGhostBorderColor: colors.neutralBorder,
    },
    Card: {
      borderRadiusLG: spacing.borderRadiusLg,
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
      borderRadius: spacing.borderRadiusLg,
    },
    Modal: {
      borderRadiusLG: spacing.borderRadiusLg,
      headerBg: colors.neutralSurface,
      titleFontSize: 18,
    },
    Drawer: {
      colorBgElevated: colors.neutralSurface,
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
      borderRadius: spacing.borderRadiusBase,
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.primaryBorder,
    },
    Select: {
      borderRadius: spacing.borderRadiusBase,
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

import { THEME_ENUM } from 'constants/theme.constant'

export const themeConfig =
{
    locale: 'en',
    cardBordered: true,
    panelExpand: false,
    controlSize: 'md',
    navMode: THEME_ENUM.NAV_MODE_THEMED,
    layout:
    {
        type: THEME_ENUM.LAYOUT_TYPE_MODERN,
        sideNavCollapse: false,
    },

    themeColor: THEME_ENUM.THEME_COLOR,
    successColor: THEME_ENUM.THEME_COLOR_SUCCESS,
    dangerColor: THEME_ENUM.THEME_COLOR_DANGER,

    direction: THEME_ENUM.DIR_LTR,
    mode: THEME_ENUM.MODE_LIGHT,

    primaryColorLevel: 500,
    secondaryColorLevel: 600,
    
    

    colorTheme: THEME_ENUM.THEME_COLOR+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    colorSecondary: THEME_ENUM.THEME_COLOR_SECONDARY+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    colorInfo: THEME_ENUM.THEME_COLOR_INFO+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    colorSuccess: THEME_ENUM.THEME_COLOR_SUCCESS+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    colorDanger: THEME_ENUM.THEME_COLOR_DANGER+'-500',
    colorWarning: THEME_ENUM.THEME_COLOR_WARNING+'-'+THEME_ENUM.THIRD_COLOR_LEVEL,

    textThemeColor: 'text-'+THEME_ENUM.THEME_COLOR+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    textSuccessColor: 'text-'+THEME_ENUM.THEME_COLOR_SUCCESS+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    textSecondaryColor: 'text-'+THEME_ENUM.THEME_COLOR_SECONDARY+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    textDangerColor: 'text-'+THEME_ENUM.THEME_COLOR_DANGER+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    textInfoColor: 'text-'+THEME_ENUM.THEME_COLOR_INFO+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    bgDanger: 'bg-'+THEME_ENUM.THEME_COLOR_DANGER+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    bgSuccess: 'bg-'+THEME_ENUM.THEME_COLOR_SUCCESS+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    bgInfo: 'bg-'+THEME_ENUM.THEME_COLOR_INFO+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,
    bgTheme: 'bg-'+THEME_ENUM.THEME_COLOR+'-'+THEME_ENUM.PRIMARY_COLOR_LEVEL,

}
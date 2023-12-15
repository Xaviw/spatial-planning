declare global {
  interface Window {
    Loca: typeof Loca
  }

  namespace Loca {
    export class Container {
      constructor(options: { map: AMap.Map })

      destroy: () => void
    }

    export interface AmbientLight {
      [key: string]: any
    }
    export interface DirectionalLight {
      [key: string]: any
    }
    export interface PointLight {
      [key: string]: any
    }
    export interface viewControl {
      [key: string]: any
    }

    export interface LegendTitle {
      /** @default '图例' */
      label?: string
      /** @default '20px' */
      fontSize?: string
      /** @default '#fff' */
      fontColor?: string
      /** @default 'bold' */
      fontWeight?: string
      /** @default '0 0 5px 0' */
      padding?: string
      /** @default '0' */
      margin?: string
    }

    export interface LegendStyle {
      /** @default 'rgba(0, 0, 0 , 0.7)' */
      backgroundColor?: string
      /** @default '14px' */
      fontSize?: string
      /** @default '#fff' */
      fontColor?: string
      /** @default '0px' */
      borderRadius?: string
      /** @default 'absolute' */
      position?: string
      top?: string
      bottom?: string
      left?: string
      right?: string
      /** @default '10px 15px' */
      padding?: string
    }

    export interface LegendDataMapItem {
      label: string
      color: string
    }

    export interface LegendProps {
      loca?: Loca.Container
      title?: LegendTitle
      style?: LegendStyle
      dataMap: LegendDataMapItem[]
    }

    export class Legend {
      constructor(options: LegendProps)

      setStyle: (options: Omit<LegendProps, 'dataMap'>) => void
      addTo: (loca: any) => void
      remove: () => void
    }
  }
}

export {}

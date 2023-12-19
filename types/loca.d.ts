declare global {
  interface Window {
    Loca: typeof Loca
  }

  namespace GeoJSON {
    export type JSON = {
      type: GeoJSONType
      bbox?: [number, number, number, number]
      crs?: {
        type: 'name'
        properties: {
          name: string
        }
      }
      geometries?: Geometry[]
      geometry?: Geometry
      features?: Feature[]
      properties?: any
      id?: string
    }

    export type Point = {
      type: 'Point'
      coordinates: [number, number]
    }

    export type MultiPoint = {
      type: 'MultiPoint'
      coordinates: [number, number][]
    }

    export type LineString = {
      type: 'LineString'
      coordinates: [number, number][]
    }

    export type MultiLineString = {
      type: 'MultiLineString'
      coordinates: [number, number][][]
    }

    export type Polygon = {
      type: 'Polygon'
      coordinates: [number, number][][]
    }

    export type MultiPolygon = {
      type: 'MultiPolygon'
      coordinates: [number, number][][][]
    }

    export type GeometryCollection = {
      type: 'GeometryCollection'
      geometries: (
        | Point
        | MultiPoint
        | LineString
        | MultiLineString
        | Polygon
        | MultiPolygon
      )[]
    }

    export type Feature = {
      type: 'Feature'
      geometry:
        | Point
        | MultiPoint
        | LineString
        | MultiLineString
        | Polygon
        | MultiPolygon
        | GeometryCollection
      properties: any
      id?: string
    }

    export type FeatureCollection = {
      type: 'FeatureCollection'
      features: Feature[]
    }

    export type GeoJSONType =
      | 'Point'
      | 'MultiPoint'
      | 'LineString'
      | 'MultiLineString'
      | 'Polygon'
      | 'MultiPolygon'
      | 'GeometryCollection'
      | 'Feature'
      | 'FeatureCollection'

    export type Geometry =
      | Point
      | MultiPoint
      | LineString
      | MultiLineString
      | Polygon
      | MultiPolygon
      | GeometryCollection
  }

  namespace Loca {
    export class Container {
      constructor(options: { map: AMap.Map })

      add(layer: Layer): void
      remove(layer: Layer): void
      clear(): void
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
      constructor(options: LegendProps): void

      setStyle: (options: Omit<LegendProps, 'dataMap'>) => void
      addTo: (loca: any) => void
      remove: () => void
    }

    export interface GeoJSONSourceProps {
      data?: GeoJSON.JSON
      url?: string
    }

    export class GeoJSONSource {
      constructor(options: GeoJSONSourceProps): void

      destroy(): void
    }

    export interface LayerProps {
      loca?: Loca.Container
      /** @default 10 */
      zIndex?: number
      /** @default true */
      visible?: boolean
      /** @default [2,20] */
      zooms?: [number, number]
      /** @default 1 */
      opacity?: number
      source?: GeoJSON.JSON
    }
    export class Layer {
      constructor(options: LayerProps): void

      setLoca(loca: Loca.Container): void
      setOpacity(opacity: number): void
      setzIndex(index: number): void
      setZooms(zoom: [number, number]): void
      show(duration?: number, callback?: EmptyFn): void
      hide(duration?: number, callback?: EmptyFn): void
      remove(): void
      destroy(): void
      queryFeature(pos: [number, number]): void
      addAnimation(config: any, callback: EmptyFn): void
      setSource(source: GeoJSONSource): void
    }

    export type FeatureFn<T> = (index: number, feature: GeoJSON.Feature) => T

    export interface PointLayerProps extends LayerProps {
      /** @default 'normal' */
      blend?: 'normal' | 'lighter'
      style?: PointLayerStyle
    }

    export interface PointLayerStyle {
      /**
       * 单位px
       * @default 20
       */
      radius?: number | FeatureFn<number>
      /** @default '#fff' */
      color?: string | FeatureFn<string>
      /** @default 'px' */
      unit?: 'px' | 'meter'
      /** @default 10 */
      borderWidth?: number | FeatureFn<number>
      /** @default '#fff' */
      borderColor?: string | FeatureFn<string>
      /**
       * 模糊半径，从哪个位置开始向边缘模糊。负数代表不进行模糊
       * @default -1
       */
      blurWidth?: number | FeatureFn<number>
    }

    export class PointLayer extends Layer {
      constructor(options: PointLayerProps): void

      setStyle(style: PointLayerStyle): void
    }
  }
}

export {}

/* eslint-disable @typescript-eslint/no-explicit-any */

import type {ComponentType} from "react"

export type TypedIntegration = "github" |"google" | "linear" | "atlassian" | string

export interface BaseWidget {
    id: string
    userId: string
    dashboardId: string
    widgetType: string
    height: number
    width: number
    config: Record<string, unknown>
    positionX: number
    positionY: number
    createdAt: Date
    updatedAt: Date
}

export interface WidgetSizes {
    desktop: { width: number; height: number }
    tablet: { width: number; height: number }
    mobile: { width: number; height: number }
}

export interface WidgetRuntimeProps<W extends BaseWidget = BaseWidget, Config = any> {
    widget: W
    editMode: boolean
    isDragging?: boolean
    onWidgetUpdate?: (widget: W) => Promise<BaseWidget>
    onWidgetDelete?: (id: string) => void
    config?: Config
    updateConfig?: (updater: Config | ((prev: Config) => Config)) => Promise<void>
}

export interface WidgetPropsBase<W extends BaseWidget = BaseWidget> {
    widget: W
    updateWidget?: (updater: W | ((prev: W) => W)) => Promise<void>
    editMode: boolean
    integration?: TypedIntegration
    isDragging?: boolean
    onWidgetDelete?: (id: string) => void
}

export interface WidgetPropsWithConfig<Config, W extends BaseWidget = BaseWidget> extends WidgetPropsBase<W> {
    config: Config
    updateConfig: (updater: Config | ((prev: Config) => Config)) => Promise<void>
}

export type WidgetProps<Config = undefined, W extends BaseWidget = BaseWidget> =
    [Config] extends [undefined]
        ? WidgetPropsBase<W>
        : WidgetPropsWithConfig<Config, W>

export interface WidgetDefinition<Config = any, W extends BaseWidget = BaseWidget> {
    name: string
    Component: ComponentType<WidgetRuntimeProps<W, Config>>
    description: string
    image: string
    tags: string[]
    sizes: WidgetSizes
    defaultConfig?: Config
    integration?: TypedIntegration
}
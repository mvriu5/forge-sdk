import type {ComponentType} from "react"

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

export type WidgetType = string

export interface WidgetPreview {
    widgetType: WidgetType
    previewImage: string
    title: string
    description: string
    tags: string[]
    sizes: {
        desktop: { width: number; height: number }
        tablet: { width: number; height: number }
        mobile: { width: number; height: number }
    }
}

/**
 * Props, die dein Dashboard an das Runtime-Component übergibt
 */
export interface WidgetRuntimeOuterProps<W extends BaseWidget = BaseWidget> {
    widget: W
    editMode: boolean
    isDragging?: boolean
    onWidgetDelete?: (id: string) => void
}

/**
 * Props, die dein eigentlicher Widget-Content bekommt
 */
export interface WidgetRuntimeInnerProps<Config, W extends BaseWidget = BaseWidget> {
    widget: W
    config: Config
    updateConfig: (updater: Config | ((prev: Config) => Config)) => Promise<void>
    editMode: boolean
    isDragging?: boolean
    onWidgetDelete?: (id: string) => void
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WidgetDefinition<Config = any, W extends BaseWidget = BaseWidget> {
    type: WidgetType
    preview: WidgetPreview
    defaultConfig: Config
    Component: ComponentType<WidgetRuntimeInnerProps<Config, W>>
}
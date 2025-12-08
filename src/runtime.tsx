"use client"

import React, { useState } from "react"
import type {
    BaseWidget,
    WidgetDefinition,
    WidgetPreview,
    WidgetRuntimeInnerProps,
    WidgetRuntimeOuterProps,
    WidgetType,
} from "./types"

/**
 * Sehr generische createWidget-Factory:
 * - kümmert sich um lokale Config-State
 * - ruft bei updateConfig einen Callback, wenn du willst (z.B. Save to DB)
 *
 * Die eigentliche DB-Integration machst du im Dashboard-Projekt,
 * indem du den Component umschließt oder updateConfig überschreibst.
 */
export function createWidget<Config, W extends BaseWidget = BaseWidget>(opts: {
    type: WidgetType
    preview: Omit<WidgetPreview, "widgetType">
    defaultConfig: Config
    Content: React.FC<WidgetRuntimeInnerProps<Config, W>>
    onConfigChange?: (widget: W, config: Config) => Promise<void> | void
}): WidgetDefinition<Config, W> {
    const { type, preview, defaultConfig, Content, onConfigChange } = opts

    const RuntimeComponent: React.FC<WidgetRuntimeOuterProps<W>> = (props) => {
        const { widget, editMode, isDragging, onWidgetDelete } = props

        const initialConfig = (widget.config ?? defaultConfig) as Config
        const [config, setConfig] = useState<Config>(initialConfig)

        const updateConfig = async (updater: Config | ((prev: Config) => Config)) => {
            const nextConfig = typeof updater === "function"
                ? (updater as (prev: Config) => Config)(config)
                : updater

            setConfig(nextConfig)

            if (onConfigChange) {
                await onConfigChange(widget, nextConfig)
            }
        }

        return (
            <Content
                widget={widget}
                config={config}
                updateConfig={updateConfig}
                editMode={editMode}
                isDragging={isDragging}
                onWidgetDelete={onWidgetDelete}
            />
        )
    }

    return {
        type,
        preview: {
            ...preview,
            widgetType: type,
        },
        defaultConfig,
        Component: RuntimeComponent,
    }
}

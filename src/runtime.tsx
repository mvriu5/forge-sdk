/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, {useCallback, useEffect, useMemo, useState} from "react"
import {
    BaseWidget,
    WidgetDefinition,
    WidgetRuntimeProps,
    TypedIntegration,
    WidgetPropsWithConfig,
    WidgetPropsBase, WidgetSizes
} from "./types"


type WidgetComponentWithConfig<Config, W extends BaseWidget = BaseWidget> = React.FC<WidgetPropsWithConfig<Config, W>>

type WidgetComponentNoConfig<W extends BaseWidget = BaseWidget> = React.FC<WidgetPropsBase<W>>

type InferConfig<C> =
    C extends WidgetComponentWithConfig<infer Config, any>
        ? Config
        : undefined

type InferWidget<C> =
    C extends WidgetComponentWithConfig<any, infer W>
        ? W
        : C extends WidgetComponentNoConfig<infer W2>
            ? W2
            : BaseWidget

export function defineWidget<C extends React.ComponentType<any>>(opts: {
    name: string
    component: C
    description: string
    image: string
    tags: string[]
    sizes: WidgetSizes
    defaultConfig?: InferConfig<C>
    integration?: TypedIntegration
    onConfigChange?: InferConfig<C> extends undefined ? never : (widget: InferWidget<C>, config: InferConfig<C>) => Promise<void> | void
}): WidgetDefinition<InferConfig<C>, InferWidget<C>> {
    type Config = InferConfig<C>
    type W = InferWidget<C>

    const { name, component, description, image, tags, sizes, defaultConfig, integration, onConfigChange } = opts

    const RunnableWidget: React.FC<WidgetRuntimeProps<W, Config>> = (props) => {
        const { widget, editMode, isDragging, onWidgetUpdate, onWidgetDelete } = props
        const resolvedConfig = (widget.config ?? defaultConfig) as Config | undefined

        const updateConfig = useCallback(async (updater: Config | ((prev: Config) => Config)) => {
            const prevConfig = (widget.config ?? defaultConfig) as Config
            const nextConfig = typeof updater === "function" ? (updater as (p: Config) => Config)(prevConfig) : updater

            await onWidgetUpdate?.({ ...(widget as any), config: nextConfig } as W)
            await onConfigChange?.(widget as W, nextConfig)
        }, [widget, onWidgetUpdate])

        const updateWidget = useCallback(async (updater: W | ((prev: W) => W)) => {
            const nextWidget = typeof updater === "function" ? (updater as (prev: W) => W)(widget as W) : updater
            await onWidgetUpdate?.(nextWidget)
        }, [widget, onWidgetUpdate])

        const TypedComponent = component as React.ComponentType<any>

        const componentProps = useMemo(() => {
            return {
                widget: widget as W,
                editMode,
                isDragging,
                updateWidget,
                onWidgetDelete,
                ...(typeof resolvedConfig !== "undefined" && {
                    config: resolvedConfig as Config,
                    updateConfig,
                }),
            }
        }, [resolvedConfig, editMode, isDragging, onWidgetDelete, updateConfig, updateWidget, widget])

        return useMemo(() => (React.createElement(TypedComponent, componentProps as any)), [TypedComponent, componentProps])
    }

    return {
        name,
        integration,
        description,
        image,
        tags,
        sizes,
        defaultConfig,
        Component: RunnableWidget,
    }
}
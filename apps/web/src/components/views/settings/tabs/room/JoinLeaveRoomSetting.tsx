/*
Copyright 2026 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { type ChangeEvent, type JSX, useCallback } from "react";
import { Field, HelpMessage, InlineField, Label, RadioInput, Root } from "@vector-im/compound-web";

import { _t } from "../../../../../languageHandler";
import { useSettingValue, useSettingValueAt } from "../../../../../hooks/useSettings";
import SettingsStore from "../../../../../settings/SettingsStore";
import { SettingLevel } from "../../../../../settings/SettingLevel";

type Choice = "default" | "show" | "hide";

/**
 * A per-room override of the "Show join/leave messages" preference, stored at the room-account level
 * so it follows the user to their other devices. "Use my default" removes the override.
 */
export function JoinLeaveRoomSetting({ roomId }: { roomId: string }): JSX.Element {
    const accountValue = useSettingValue("showJoinLeaves");
    const roomValue = useSettingValueAt(SettingLevel.ROOM_ACCOUNT, "showJoinLeaves", roomId, true);
    const current: Choice = roomValue === true ? "show" : roomValue === false ? "hide" : "default";

    const onChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.checked) return;
            const choice = event.target.value as Choice;
            const value = choice === "default" ? null : choice === "show";
            void SettingsStore.setValue("showJoinLeaves", roomId, SettingLevel.ROOM_ACCOUNT, value);
        },
        [roomId],
    );

    const option = (choice: Choice, label: string): JSX.Element => (
        <InlineField
            name={`mx_JoinLeaveRoomSetting_${choice}`}
            control={
                <RadioInput
                    id={`mx_JoinLeaveRoomSetting_${choice}`}
                    name="mx_JoinLeaveRoomSetting"
                    value={choice}
                    checked={current === choice}
                    onChange={onChange}
                />
            }
        >
            <Label htmlFor={`mx_JoinLeaveRoomSetting_${choice}`}>{label}</Label>
        </InlineField>
    );

    return (
        <Root className="mx_JoinLeaveRoomSetting">
            {/* Explicit label here because htmlFor is not supported for linking to radiogroups */}
            <Field
                id="mx_JoinLeaveRoomSetting"
                role="radiogroup"
                name="join_leave"
                aria-label={_t("room_settings|general|join_leave_label")}
            >
                <Label>{_t("room_settings|general|join_leave_label")}</Label>
                <HelpMessage>{_t("room_settings|general|join_leave_description")}</HelpMessage>
                {option(
                    "default",
                    accountValue
                        ? _t("room_settings|general|join_leave_default_shown")
                        : _t("room_settings|general|join_leave_default_hidden"),
                )}
                {option("show", _t("room_settings|general|join_leave_show"))}
                {option("hide", _t("room_settings|general|join_leave_hide"))}
            </Field>
        </Root>
    );
}

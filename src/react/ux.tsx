/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Conference } from "../schema/app_schema.js";
import { ClientSession } from "../schema/session_schema.js";
import "../output.css";
import { IFluidContainer, IMember, IServiceAudience, TreeView } from "fluid-framework";
import { Canvas } from "./canvas_ux.js";
import { undoRedo } from "../utils/undo.js";
import { undefinedUserId } from "../utils/utils.js";
import Prompt from "./prompt_ux.js";
import { UserAvatars } from "./avatars_ux.js";

export function ReactApp(props: {
	conferenceTree: TreeView<typeof Conference>;
	sessionTree: TreeView<typeof ClientSession>;
	audience: IServiceAudience<IMember>;
	container: IFluidContainer;
	undoRedo: undoRedo;
	insertTemplate: (prompt: string) => Promise<void>;
}): JSX.Element {
	const [currentUser, setCurrentUser] = useState(undefinedUserId);
	const [connectionState, setConnectionState] = useState("");
	const [saved, setSaved] = useState(false);
	const [fluidMembers, setFluidMembers] = useState<string[]>([]);
	const [isPromptOpen, setIsPromptOpen] = useState(false);

	/** Unsubscribe to undo-redo events when the component unmounts */
	useEffect(() => {
		return props.undoRedo.dispose;
	}, []);

	return (
		<>
			<div
				id="main"
				className="flex flex-col bg-gray-100 h-screen w-full overflow-hidden overscroll-none"
			>
				<Header
					saved={saved}
					connectionState={connectionState}
					fluidMembers={fluidMembers}
					clientId={currentUser}
				/>
				<div className="flex h-[calc(100vh-48px)] flex-row ">
					<Canvas
						conferenceTree={props.conferenceTree}
						sessionTree={props.sessionTree}
						audience={props.audience}
						container={props.container}
						fluidMembers={fluidMembers}
						currentUser={currentUser}
						undoRedo={props.undoRedo}
						setCurrentUser={setCurrentUser}
						setConnectionState={setConnectionState}
						setSaved={setSaved}
						setFluidMembers={setFluidMembers}
						setShowPrompt={setIsPromptOpen}
					/>
				</div>
			</div>
			<Prompt
				insertTemplate={props.insertTemplate}
				isOpen={isPromptOpen}
				setIsOpen={setIsPromptOpen}
			/>
		</>
	);
}

export function Header(props: {
	saved: boolean;
	connectionState: string;
	fluidMembers: string[];
	clientId: string;
}): JSX.Element {
	return (
		<div className="h-[48px] flex shrink-0 flex-row items-center justify-between bg-black text-base text-white z-40 w-full">
			<div className="flex m-2">Planner</div>
			<div className="flex m-2 items-center">
				{props.saved ? "saved" : "not saved"} | {props.connectionState} |
				<UserAvatars fluidMembers={props.fluidMembers} layoutType="spread" />
			</div>
		</div>
	);
}

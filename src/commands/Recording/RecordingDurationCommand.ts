import { Timecode } from '../../state/common'
import { ProtocolVersion } from '../../enums'
import { InvalidIdError, AtemState } from '../../state'
import { DeserializedCommand, BasicWritableCommand } from '../CommandBase'

export class RecordingRequestDurationCommand extends BasicWritableCommand<{}> {
	public static readonly rawName = 'RMDR'
	public static readonly minimumVersion = ProtocolVersion.V8_1_1

	constructor() {
		super({})
	}

	public serialize(): Buffer {
		return Buffer.alloc(0)
	}
}

export class RecordingDurationUpdateCommand extends DeserializedCommand<Timecode> {
	public static readonly rawName = 'RTMR'
	public static readonly minimumVersion = ProtocolVersion.V8_1_1

	constructor(properties: Timecode) {
		super(properties)
	}

	public static deserialize(rawCommand: Buffer): RecordingDurationUpdateCommand {
		const props: Timecode = {
			hours: rawCommand.readUInt8(0),
			minutes: rawCommand.readUInt8(1),
			seconds: rawCommand.readUInt8(2),
			frames: rawCommand.readUInt8(3),
			isDropFrame: rawCommand.readUInt8(4) != 0
		}

		return new RecordingDurationUpdateCommand(props)
	}

	public applyToState(state: AtemState): string {
		if (!state.recording) {
			throw new InvalidIdError('Recording')
		}

		state.recording.duration = this.properties

		return `recording.duration`
	}
}

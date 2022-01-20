interface DropPositionMonitorProps {
    onDropTop: () => void;
    onDropInner: () => void;
    onDropUnder: () => void;
    active: boolean;
}

export const DropPositionMonitor = ({
    onDropInner,
    onDropTop,
    onDropUnder,
    active,
}: DropPositionMonitorProps) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'transparent',
                pointerEvents: active ? undefined : 'none',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Drop on top */}
            <DropPositionMonitorInner onHover={onDropTop} height={10} />
            {/* Drop inside */}
            <DropPositionMonitorInner onHover={onDropInner} height={20} />
            {/* Drop on bottom */}
            <DropPositionMonitorInner onHover={onDropUnder} height={10} />
        </div>
    );
};

const DropPositionMonitorInner = ({
    height,
    onHover,
}: {
    height: number;
    onHover: () => void;
}) => {
    return (
        <div
            onMouseOver={onHover}
            style={{
                height,
                width: '100%',
            }}
        ></div>
    );
};

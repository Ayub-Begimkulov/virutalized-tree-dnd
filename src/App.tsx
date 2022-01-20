import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Tree } from './Tree';

const options = {
    enableMouseEvents: true,
};

export default function App() {
    return (
        <DndProvider backend={TouchBackend} options={options}>
            <Tree />
        </DndProvider>
    );
}

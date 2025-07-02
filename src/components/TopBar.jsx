import useStore from '../store/useStore';

export default function TopBar() {

    const { toggleVisGrid, visGrid } = useStore();


    const toggleGrid = () => {
        toggleVisGrid();
    }

    return (
        <div className="fixed top-0 right-0 flex justify-between items-center gap-2 p-4 z-100">
            <button
                onClick={toggleGrid}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {visGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
        </div>
    );
}
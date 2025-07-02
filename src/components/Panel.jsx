import { useState, useRef } from 'react'
import Modal from './Modal';
import { parseMacro } from '../helpers/macroParser';
import useStore from '../store/useStore';
import { toast } from 'react-toastify';

export default function Panel() {
    const { geometries, setGeometries } = useStore();
    const [isOpen, setIsOpen] = useState(true)
    const [isModalOpen, setModalOpen] = useState(false);
    const macroFileInputRef = useRef(null);


    const shapes = [
        { type: 'box', label: 'Cube' },
        { type: 'cuboid', label: 'Cuboid' },
        { type: 'sphere', label: 'Sphere' },
        { type: 'cylinder', label: 'Cylinder' },
    ]


    const clearAllGeometries = () => {
        setGeometries([]);
        macroFileInputRef.current.value = null;
    }


    const handleMacFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result;
            const geometries = parseMacro(text);
            console.log('geometries:', geometries);
            setGeometries(geometries);
        };

        reader.readAsText(file);
    }


    const toggleVisibilityAll = () => {
        const allVisible = geometries.every((g) => g.vis.visible);
        const newVisibility = !allVisible;

        setGeometries(
            geometries.map((g) => ({
                ...g,
                vis: {
                    ...g.vis,
                    visible: newVisibility,
                },
            }))
        );
    };


    const toggleVisibility = (geometry) => {
        useStore.setState((state) => ({
            geometries: state.geometries.map((g) =>
                g.id === geometry.id
                    ? {
                        ...g,
                        vis: {
                            ...g.vis,
                            visible: !g.vis.visible,
                        },
                    }
                    : g
            ),
        }));
    };


    const hideOthers = (geometry) => {
        const visibleGeometry = geometries.find((g) => g.id === geometry.id);
        useStore.setState((state) => ({
            geometries: state.geometries.map((g) => ({
                ...g,
                vis: {
                    ...g.vis,
                    visible: g.id === visibleGeometry?.id,
                },
            })),
        }));
    };


    const toggleWireframeSolid = (geometry) => {
        useStore.setState((state) => ({
            geometries: state.geometries.map((g) =>
                g.id === geometry.id
                    ? {
                        ...g,
                        vis: {
                            ...g.vis,
                            wireframe: !g.vis.wireframe,
                        },
                    }
                    : g
            ),
        }));
    };


    const handleGeometryDimChange = (geometryId, dim, size) => {
        useStore.setState((state) => ({
            geometries: state.geometries.map((g) =>
                g.id === geometryId
                    ? {
                        ...g,
                        geometry: {
                            ...g.geometry,
                            [dim]: `${size} cm`,
                        },
                    }
                    : g
            ),
        }));
    }


    const copyTransToClipboard = (geometry) => {
        const transX = parseFloat(geometry.geometry.translation?.x);
        const transY = parseFloat(geometry.geometry.translation?.y);
        const transZ = parseFloat(geometry.geometry.translation?.z);

        const macroCommand = `/gate/${geometry.name}/placement/setTranslation ${transX === 0 ? '0.' : transX} ${transY === 0 ? '0.' : transY} ${transZ === 0 ? '0.' : transZ} cm`
        navigator.clipboard.writeText(macroCommand.trim());
        toast.success('Copied translations to clipboard');

    }


    const copyDimsToClipboard = (geometry) => {
        const geometryX = geometry.geometry.xLength;
        const geometryY = geometry.geometry.yLength;
        const geometryZ = geometry.geometry.zLength;

        const macroCommand = `
        /gate/${geometry.name}/geometry/setXLength ${geometryX}\n/gate/${geometry.name}/geometry/setYLength ${geometryY}\n/gate/${geometry.name}/geometry/setZLength ${geometryZ}
        `
        navigator.clipboard.writeText(macroCommand.trim());
        toast.success('Copied dimensions to clipboard');

    }

    const handleGeometryPosChange = (geometryId, axis, value) => {
        useStore.setState((state) => ({
            geometries: state.geometries.map((g) =>
                g.id === geometryId
                    ? {
                        ...g,
                        geometry: {
                            ...g.geometry,
                            translation: {
                                ...g.geometry.translation,
                                [axis]: `${value} cm`,
                            }
                        },
                    }
                    : g
            ),
        }));
    }



    return (
        <div
            className={`absolute top-0 left-0 h-full bg-dark bg-opacity-50 backdrop-blur-md shadow-xl shadow-gray-900 transition-all duration-300 ${isOpen ? 'w-[600px]' : 'w-[60px]'
                }`}
        >
            <div className="flex items-center justify-between p-2 border-b">
                <h2 className="text-xl font-bold">
                    {isOpen ? 'Spect-3D-Placer' : ''}</h2>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded"
                >
                    {isOpen ? '<' : '>'}
                </button>
            </div>

            {isOpen && (
                <div className="p-2 space-y-5 text-sm">
                    {/* Add geometry from .mac file */}
                    <div>
                        <button
                            className='w-full bg-red-600 text-white px-2 py-2 my-2 rounded hover:bg-red-800'
                            onClick={clearAllGeometries}
                        >Clear all Geometries</button>
                        <label
                            className="font-semibold mb-2 block"
                            htmlFor="mac_file"
                        ><h2>Load .mac file</h2></label>
                        <input
                            ref={macroFileInputRef}
                            id='mac_file'
                            className="w-full bg-dark outline text-white px-2 py-2 my-2 rounded hover:outline-blue-600"
                            type="file"
                            accept=".mac"
                            placeholder='Upload .mac file'
                            onChange={handleMacFileUpload}
                        />

                    </div>

                    {geometries.length > 0 && (
                        <div className="mt-4">
                            <div className="flex justify-between">
                                <h2 className="font-semibold mb-2 text-lg">Geometries</h2>
                                <button
                                    className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    onClick={toggleVisibilityAll}
                                >
                                    {
                                        geometries.every((g) => g.vis.visible) ? 'Hide All' : 'Show All'
                                    }
                                </button>
                            </div>
                            <ul className="space-y-2 p-2 max-h-[60vh] overflow-y-auto pr-1 bg-gradient-to-b from-black/30 via-black/20 to-black/30
                shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] border border-gray-700 rounded-lg " >
                                {geometries.map((geometry) => (
                                    <li
                                        key={geometry.id}
                                        className="border border-gray-600 rounded-lg shadow-sm bg-transparent backdrop-blur-sm"
                                    >
                                        <details className="p-3">
                                            <summary className="cursor-pointer font-semibold">
                                                {geometry.name} {!geometry.vis.visible && "[hidden]"}
                                            </summary>
                                            <div className="mt-2 flex justify-between items-center">
                                                <div
                                                    className='flex flex-col gap-1'
                                                >
                                                    <p className="text-sm text-white">Type: {geometry.type}</p>
                                                    <p className="text-sm text-white">Color: {geometry.vis.color}</p>
                                                    <details className='cursor-pointer'>
                                                        <summary className="text-sm text-white cursor-pointer">
                                                            Show Details
                                                        </summary>
                                                        <div>
                                                            Dimensions: {geometry.geometry.xLength} x {geometry.geometry.yLength} x {geometry.geometry.zLength}
                                                        </div>
                                                        <div className='flex justify-evenly align-center flex-wrap mb-2 '>
                                                            <div className='w-[20%] flex flex-col'>
                                                                <label className='cursor-ew-resize py-1' htmlFor="xLength">X-Length</label>
                                                                <input
                                                                    className='border border-white/50 rounded p-1' type="number" value={parseFloat(geometry.geometry.xLength)}
                                                                    onChange={e => handleGeometryDimChange(geometry.id, 'xLength', e.currentTarget.value)}
                                                                />
                                                            </div>
                                                            <div className='w-[20%] flex flex-col'>
                                                                <label className='cursor-ew-resize py-1' htmlFor="yLength">Y-Length</label>
                                                                <input
                                                                    className='border border-white/50 rounded p-1' type="number" value={parseFloat(geometry.geometry.yLength)}
                                                                    onChange={e => handleGeometryDimChange(geometry.id, 'yLength', e.currentTarget.value)}
                                                                />
                                                            </div>
                                                            <div className='w-[20%] flex flex-col'>
                                                                <label className='cursor-ew-resize py-1' htmlFor="zLength">Z-Length</label>
                                                                <input
                                                                    className='border border-white/50 rounded p-1' type="number" value={parseFloat(geometry.geometry.zLength)}
                                                                    onChange={e => handleGeometryDimChange(geometry.id, 'zLength', e.currentTarget.value)}
                                                                />
                                                            </div>

                                                            <button
                                                                className='px-4 py-1 bg-blue-600 text-white rounded'
                                                                onClick={() => copyDimsToClipboard(geometry)}
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                        <div className='flex justify-evenly align-center flex-wrap mb-2 '>
                                                            <div className='w-[20%] flex flex-col'>
                                                                <label className='cursor-ew-resize py-1' htmlFor="xTranslation">X-Translation</label>
                                                                <input
                                                                    step="0.1"
                                                                    className='border border-white/50 rounded p-1' type="number" value={parseFloat(geometry.geometry.translation?.x)}
                                                                    onChange={e => handleGeometryPosChange(geometry.id, 'x', e.currentTarget.value)}
                                                                />
                                                            </div>
                                                            <div className='w-[20%] flex flex-col'>
                                                                <label className='cursor-ew-resize py-1' htmlFor="yTranslation">Y-Translation</label>
                                                                <input
                                                                    step="0.1"
                                                                    className='border border-white/50 rounded p-1' type="number" value={parseFloat(geometry.geometry.translation?.y)}
                                                                    onChange={e => handleGeometryPosChange(geometry.id, 'y', e.currentTarget.value)}
                                                                />
                                                            </div>
                                                            <div className='w-[20%] flex flex-col'>
                                                                <label className='cursor-ew-resize py-1' htmlFor="zTranslation">Z-Translation</label>
                                                                <input
                                                                    step="0.1"
                                                                    className='border border-white/50 rounded p-1' type="number" value={parseFloat(geometry.geometry.translation?.z)}
                                                                    onChange={e => handleGeometryPosChange(geometry.id, 'z', e.currentTarget.value)}
                                                                />
                                                            </div>


                                                            <button
                                                                className='px-4 py-1 bg-blue-600 text-white rounded'
                                                                onClick={() => copyTransToClipboard(geometry)}
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                    </details>
                                                </div>


                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                <button
                                                    className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    onClick={() => toggleVisibility(geometry)}
                                                >
                                                    {geometry.vis.visible === true ? 'Hide' : 'Show'}
                                                </button>
                                                {
                                                    geometry.vis.visible &&
                                                    <button
                                                        className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                        onClick={() => toggleWireframeSolid(geometry)}
                                                    >
                                                        {geometry.vis.wireframe === true ? 'Solid' : 'Wireframe'}
                                                    </button>

                                                }
                                                <button
                                                    className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    onClick={() => hideOthers(geometry)}
                                                >
                                                    Hide Others
                                                </button>

                                            </div>
                                        </details>
                                        <div className='absolute right-5 top-1/4 border border-gray-600 p-2 rounded-full'
                                            style={{
                                                backgroundColor: geometry.vis.color
                                            }}
                                        ></div>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 3D Objects Section */}
                    <div>
                        <h2 className="font-semibold mb-2"> Add 3D Objects</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {shapes.map((shape) => (
                                <button
                                    key={shape.type}
                                    onClick={() => handleShapeAdd(shape.type)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                >
                                    {shape.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Other sections can be added here later */}
                </div>
            )
            }

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={'Add 3D Object'}
                children={
                    <>
                        hello world
                    </>
                }
            />
        </div >
    )
}

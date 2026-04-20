import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, LayoutGrid, List, Map, Filter, User, Search, Pin, Edit2, Trash2, Tag, Layers, CheckCircle2 } from 'lucide-react';
import useDataStore from '../../store/dataStore';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CreateTableModal from './CreateTableModal';
import Card from '../../components/ui/Card';
import { TABLE_STATUSES, TABLE_IMAGES, TABLE_LOCATIONS, STATUS_DOT_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function TableManagementPage() {
<<<<<<< HEAD
  const { tables, tablesLoading, fetchTables, updateTableStatus, deleteTable } = useDataStore();
=======
  const { tables, tablesLoading, fetchTables, updateTableStatus } = useDataStore();
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(null);
  
  // View states
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map

  // Filter states
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [floorFilter, setFloorFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [capacityFilter, setCapacityFilter] = useState(20);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleStatusChange = async (tableId, newStatus) => {
    const loadingToast = toast.loading('Updating status...');
    setStatusMenuOpen(null);
    const result = await updateTableStatus(tableId, newStatus);
    if (result.success) {
      toast.success(`Table status updated to ${newStatus}`, { id: loadingToast });
    } else {
      toast.error(result.message, { id: loadingToast });
    }
  };

<<<<<<< HEAD
  const handleDeleteTable = async (tableId) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    const loadingToast = toast.loading('Deleting table...');
    const result = await deleteTable(tableId);
    if (result.success) {
      toast.success('Table deleted successfully', { id: loadingToast });
    } else {
      toast.error(result.message, { id: loadingToast });
    }
  };

=======
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
  const statusOptions = Object.values(TABLE_STATUSES);

  const clearFilters = () => {
      setSearchFilter('');
      setStatusFilter('ALL');
      setFloorFilter('ALL');
      setLocationFilter('ALL');
      setCapacityFilter(20);
  };

  // Derived data
  const filteredTables = tables.filter(t => {
      if(searchFilter && !t.tableNumber?.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      if(statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if(floorFilter !== 'ALL' && t.floorNumber?.toString() !== floorFilter) return false;
      if(locationFilter !== 'ALL' && t.location !== locationFilter) return false;
      if(t.capacity > capacityFilter) return false;
      return true;
  });

  const maintenanceCount = tables.filter(t => t.status === 'MAINTENANCE').length;
  
  // Floor unique values
  const floors = [...new Set(tables.map(t => t.floorNumber))].filter(Boolean).sort();

  if (tablesLoading) {
    return <LoadingSpinner size="lg" text="Loading tables..." />;
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto animate-fade-in">
        
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Table Inventory
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage physical tables, capacity, and current status
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-1">
                 <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                     <LayoutGrid className="w-4 h-4" />
                 </button>
                 <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                     <List className="w-4 h-4" />
                 </button>
                 <button onClick={() => setViewMode('map')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                     <Map className="w-4 h-4" />
                 </button>
             </div>
             
            <Button variant="secondary" onClick={() => fetchTables()} size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button onClick={() => setCreateModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Add New Table
            </Button>
          </div>
        </div>

        {/* Advanced Filter Bar */}
        <Card className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                {/* Search */}
                <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Search Table</label>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="T-01..." 
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                        />
                    </div>
                </div>

                 {/* Filters */}
                 <div className="w-full md:w-40">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Layers className="w-3 h-3"/> Floor</label>
                    <select 
                       value={floorFilter} onChange={e => setFloorFilter(e.target.value)}
                       className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none"
                    >
                        <option value="ALL">All Floors</option>
                        {floors.map(f => <option key={f} value={f}>Floor {f}</option>)}
                    </select>
                 </div>

                 <div className="w-full md:w-48">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1"><Pin className="w-3 h-3"/> Location</label>
                    <select 
                       value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                       className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none"
                    >
                        <option value="ALL">All Locations</option>
                        {TABLE_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                 </div>

                 <div className="w-full md:w-48 pb-1">
                     <div className="flex justify-between items-end mb-1.5">
                         <label className="text-xs font-medium text-gray-500">Max Capacity</label>
                         <span className="text-xs font-bold">{capacityFilter} guests</span>
                     </div>
                     <input 
                         type="range" min="1" max="20" step="1" 
                         value={capacityFilter} onChange={e => setCapacityFilter(parseInt(e.target.value))}
                         className="w-full accent-brand-orange" 
                      />
                 </div>
                 
                 <Button variant="ghost" onClick={clearFilters} size="sm" className="mb-0.5 text-gray-500">
                     Reset
                 </Button>
            </div>
            
            {/* Status Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-400 mr-2 flex items-center gap-1"><Filter className="w-3 h-3" /> Status:</span>
                <button 
                   onClick={() => setStatusFilter('ALL')}
                   className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'ALL' ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'}`}
                >
                    All
                </button>
                {statusOptions.map(status => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border flex items-center gap-1.5 
                      ${statusFilter === status 
                          ? 'bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-600 shadow-sm text-gray-900 dark:text-white' 
                          : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[status]}`}></div>
                        <span className="capitalize">{status.toLowerCase()}</span>
                    </button>
                ))}
                
                <div className="ml-auto text-xs text-gray-500 font-medium">
                    Showing {filteredTables.length} of {tables.length} tables
                </div>
            </div>
        </Card>

        {/* View Content */}
        {filteredTables.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-surface-dark rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-2">No tables found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Try adjusting your filters or create a new table to get started.</p>
              <Button onClick={() => setCreateModalOpen(true)}>Add New Table</Button>
            </div>
        ) : viewMode === 'grid' ? (
            /* Tables Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTables.map((table) => {
                const imageIndex = (table.id || 0) % TABLE_IMAGES.length;
                return (
<<<<<<< HEAD
                  <Card key={table.id} padding="p-0" className={`group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 rounded-2xl ${statusMenuOpen === table.id ? 'relative z-50' : 'relative z-10'}`}>
                    {/* Image header */}
                    <div className="relative h-36 overflow-hidden rounded-t-2xl">
=======
                  <Card key={table.id} padding="p-0" className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800">
                    {/* Image header */}
                    <div className="relative h-36 overflow-hidden">
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                      <img src={TABLE_IMAGES[imageIndex]} alt={`Table ${table.tableNumber}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                         <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider flex items-center gap-1">
                             <Layers className="w-3 h-3" /> Floor {table.floorNumber || 1}
                         </span>
                         <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-black/70 backdrop-blur-md text-[10px] font-bold text-gray-900 dark:text-white flex items-center gap-1">
                             <User className="w-3 h-3" /> {table.capacity} Pax
                         </span>
                      </div>
                      
                      {/* Bottom Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div>
                              <p className="text-2xl font-black text-white leading-none mb-1">{table.tableNumber || `T-${table.id}`}</p>
                              <p className="text-xs text-gray-300 flex items-center gap-1"><Pin className="w-3 h-3" /> {table.location}</p>
                          </div>
                      </div>
                    </div>
    
<<<<<<< HEAD
                    <div className="p-4 bg-white dark:bg-surface-dark rounded-b-2xl">
=======
                    <div className="p-4 bg-white dark:bg-surface-dark">
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                      
                      {/* Custom Status Dropdown */}
                      <div className="relative mt-1">
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Current Status</label>
                        <button
                          onClick={() => setStatusMenuOpen(statusMenuOpen === table.id ? null : table.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border ${table.status === 'AVAILABLE' ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-800/30' : table.status === 'OCCUPIED' ? 'bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-800/30' : 'bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700/50'} transition-colors`}
                        >
                          <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT_COLORS[table.status]}`}></div>
                              <span className="text-sm font-semibold capitalize text-gray-900 dark:text-white">{table.status.toLowerCase()}</span>
                          </div>
                          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${statusMenuOpen === table.id ? 'rotate-180' : ''}`} />
                        </button>
    
                        {statusMenuOpen === table.id && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 py-1.5 animate-scale-in">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(table.id, status)}
                                disabled={table.status === status}
                                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors
                                  ${table.status === status
                                      ? 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 cursor-default'
                                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                  }`}
                              >
                                <div className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[status]}`}></div>
                                <span className={`capitalize ${table.status === status ? 'font-semibold' : ''}`}>{status.toLowerCase()}</span>
                                {table.status === status && <CheckCircle2 className="w-4 h-4 ml-auto text-brand-orange" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Actions (Hover visible) */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-gray-500 font-medium">Quick Actions</span>
                          <div className="flex gap-2">
                             <button className="p-1.5 text-gray-400 hover:text-brand-orange transition-colors"><Edit2 className="w-4 h-4" /></button>
<<<<<<< HEAD
                             <button onClick={() => handleDeleteTable(table.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
=======
                             <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                          </div>
                      </div>
                      
                      {/* Fallback for touch devices lacking hover */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center lg:hidden">
                           <span className="text-xs text-gray-500 font-medium">Quick Edit</span>
                           <Edit2 className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
        ) : viewMode === 'list' ? (
            /* List View */
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Table #</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Capacity</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Location / Floor</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Current Status</th>
                                <th className="px-6 py-4 font-medium text-right uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-900 dark:text-gray-100">
                            {filteredTables.map(table => (
                                <tr key={table.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4 font-bold max-w-[120px] truncate">{table.tableNumber}</td>
                                    <td className="px-6 py-4"><span className="flex items-center gap-1 text-gray-500"><User className="w-3.5 h-3.5"/> {table.capacity}</span></td>
                                    <td className="px-6 py-4"><span className="text-gray-500">{table.location} • Fl {table.floorNumber}</span></td>
                                    <td className="px-6 py-4"><StatusBadge status={table.status} size="sm" /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-gray-400 hover:text-brand-orange transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
<<<<<<< HEAD
                                            <button onClick={() => handleDeleteTable(table.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
=======
                                            <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
             /* Map View Mock */
             <div className="p-12 text-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl">
                 <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-bold">Floor Plan View</h3>
                 <p className="text-gray-500 text-sm mt-1 mb-4">Interactive floor plan visualization coming in a future update.</p>
                 <Button variant="outline" onClick={() => setViewMode('grid')}>Return to Grid</Button>
             </div>
        )}
      </div>

      {/* Right Sidebar - Widgets */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-6">
          {/* Quick Add Table */}
          <Card className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-orange" /> Quick Add Table
              </h3>
              <p className="text-xs text-gray-500 mb-4 tracking-wide leading-relaxed">Add a single table quickly without opening the full detailed modal.</p>
              <Button fullWidth onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-brand-orange to-brand-gold border-0 shadow-md shadow-brand-orange/20">
                  Open Creator
              </Button>
          </Card>

          {/* Table Statistics */}
          <Card className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
               <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-blue-500" /> Table Statistics
              </h3>
              
              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 font-medium">Maintenance Needs</span>
                          <span className="font-bold text-gray-900 dark:text-white">{maintenanceCount} tables</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${(maintenanceCount/Math.max(tables.length, 1))*100}%` }}></div>
                      </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Capacity Breakdown</p>
                      
                      <div className="space-y-3 hidden sm:block"> {/* Bar chart mock */}
                          <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 w-8">2 Pax</span>
                              <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-blue-400 h-full w-[40%] rounded-full"></div>
                              </div>
                              <span className="text-xs font-medium w-4 text-right">40%</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 w-8">4 Pax</span>
                              <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-brand-orange h-full w-[35%] rounded-full"></div>
                              </div>
                              <span className="text-xs font-medium w-4 text-right">35%</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 w-8">6+ Pax</span>
                              <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-green-400 h-full w-[25%] rounded-full"></div>
                              </div>
                              <span className="text-xs font-medium w-4 text-right">25%</span>
                          </div>
                      </div>
                  </div>
              </div>
          </Card>
      </div>

      <CreateTableModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}

// Icon helper
function ChevronDownIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Tag,
  Badge,
  Pagination,
  Space,
  Empty,
  Tooltip,
  Radio,
  Select,
} from 'antd';
import {
  SearchOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
  ClearOutlined,
  FilterOutlined,
} from '@ant-design/icons';


export interface WorkshopSelectorItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  category?: string;
  type?: string;
  priority?: string;
  status?: string;
  tags?: string[];
  [key: string]: any;
}

interface WorkshopEntitySelectorProps {
  stepNumber: number;
  title: string;
  subtitle?: string;
  entityType: 'component' | 'module' | 'template' | 'rule' | 'specification';
  items: WorkshopSelectorItem[];
  selectedIds: string[];
  onChange: (newSelectedIds: string[]) => void;
  accentColor?: string;
  pageSize?: number;
  onInspect?: (entityType: string, id: string) => void;
}

export const WorkshopEntitySelector: React.FC<WorkshopEntitySelectorProps> = ({
  stepNumber,
  title,
  subtitle,
  entityType,
  items,
  selectedIds,
  onChange,
  accentColor = '#F56738',
  pageSize = 10,
  onInspect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSelectedChips, setShowSelectedChips] = useState(true);

  // Extract available categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      const c = item.category || item.type || item.priority;
      if (c) cats.add(c);
    });
    return Array.from(cats).sort();
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return items.filter((item) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        item.category === selectedCategory ||
        item.type === selectedCategory ||
        item.priority === selectedCategory;

      if (!matchCat) return false;
      if (!query) return true;

      const nameMatch = (item.name || item.title || '').toLowerCase().includes(query);
      const descMatch = (item.description || item.summary || '').toLowerCase().includes(query);
      const idMatch = item.id.toLowerCase().includes(query);
      const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(query));

      return nameMatch || descMatch || idMatch || tagMatch;
    });
  }, [items, searchTerm, selectedCategory]);

  // Paginated slice
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Selected item lookup
  const selectedItemsMap = useMemo(() => {
    const map = new Map<string, WorkshopSelectorItem>();
    items.forEach((item) => {
      if (selectedIds.includes(item.id)) {
        map.set(item.id, item);
      }
    });
    return map;
  }, [items, selectedIds]);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleSelectVisible = () => {
    const pageIds = paginatedItems.map((item) => item.id);
    const newSet = new Set([...selectedIds, ...pageIds]);
    onChange(Array.from(newSet));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getTagColor = () => {
    switch (entityType) {
      case 'component':
        return 'orange';
      case 'module':
        return 'cyan';
      case 'template':
        return 'blue';
      case 'rule':
        return 'purple';
      case 'specification':
        return 'magenta';
      default:
        return 'default';
    }
  };

  return (
    <Card
      className="mb-6 shadow-2xs border-loft-border transition hover:shadow-xs"
      styles={{
        header: {
          borderBottom: '1px solid #F0F4F8',
          padding: '16px 20px',
        },
        body: {
          padding: '16px 20px',
        },
      }}
      title={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs"
              style={{ backgroundColor: accentColor }}
            >
              {stepNumber}
            </span>
            <div>
              <div className="font-semibold text-sm text-loft-dark">{title}</div>
              {subtitle && <div className="text-[11px] text-loft-muted font-normal">{subtitle}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              count={`${selectedIds.length} selecionado${selectedIds.length !== 1 ? 's' : ''}`}
              style={{
                backgroundColor: selectedIds.length > 0 ? accentColor : '#9AA5B1',
                fontWeight: 600,
                fontSize: '11px',
                padding: '0 8px',
              }}
            />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search, Filter & View Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAFBFD] p-3 rounded-lg border border-loft-border">
          <div className="flex-1 min-w-[220px]">
            <Input
              prefix={<SearchOutlined className="text-[#9AA5B1]" />}
              placeholder={`Buscar em ${items.length} ${entityType === 'component' ? 'componentes' : entityType === 'module' ? 'módulos' : entityType === 'rule' ? 'regras' : entityType === 'template' ? 'templates' : 'especificações'}...`}
              value={searchTerm}
              allowClear
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              size="middle"
              className="rounded-md"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.length > 1 && (
              <div className="flex items-center gap-1.5">
                <FilterOutlined className="text-loft-muted text-xs" />
                <Select
                  value={selectedCategory}
                  onChange={(val) => {
                    setSelectedCategory(val);
                    setCurrentPage(1);
                  }}
                  size="middle"
                  style={{ minWidth: 180 }}
                  options={[
                    { value: 'ALL', label: `Todos (${items.length})` },
                    ...categories.map((cat) => {
                      const count = items.filter(
                        (i) => i.category === cat || i.type === cat || i.priority === cat
                      ).length;
                      return {
                        value: cat,
                        label: `${cat} (${count})`,
                      };
                    }),
                  ]}
                />
              </div>
            )}


            <div className="h-4 w-px bg-loft-border hidden sm:block" />

            {/* Quick Actions */}
            <Space size="small">
              <Tooltip title="Selecionar todos os 10 itens desta página">
                <Button
                  size="small"
                  icon={<CheckSquareOutlined />}
                  onClick={handleSelectVisible}
                  disabled={paginatedItems.length === 0}
                >
                  Marcar Página
                </Button>
              </Tooltip>

              {selectedIds.length > 0 && (
                <Tooltip title="Desmarcar todos os itens selecionados">
                  <Button
                    size="small"
                    danger
                    icon={<ClearOutlined />}
                    onClick={handleClearAll}
                  >
                    Limpar
                  </Button>
                </Tooltip>
              )}

              <Radio.Group
                size="small"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="grid">
                  <AppstoreOutlined />
                </Radio.Button>
                <Radio.Button value="list">
                  <UnorderedListOutlined />
                </Radio.Button>
              </Radio.Group>
            </Space>
          </div>
        </div>

        {/* Selected Items Chips Tray */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 bg-[#FFF9F6] border border-[#FED7D7] rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-[#C53030] uppercase tracking-wide flex items-center gap-1">
                <span>Itens Selecionados ({selectedIds.length}):</span>
              </span>
              <Button
                type="link"
                size="small"
                className="text-[11px] p-0 text-[#C53030]"
                onClick={() => setShowSelectedChips(!showSelectedChips)}
              >
                {showSelectedChips ? 'Ocultar Chips' : 'Mostrar Chips'}
              </Button>
            </div>

            {showSelectedChips && (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-0.5">
                {selectedIds.map((id) => {
                  const item = selectedItemsMap.get(id);
                  const label = item?.name || item?.title || id;
                  return (
                    <Tag
                      key={id}
                      closable
                      onClose={() => handleToggle(id)}
                      color="volcano"
                      className="text-xs flex items-center gap-1 font-medium bg-white text-loft-dark border-[#FED7D7]"
                    >
                      <span>{label}</span>
                    </Tag>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Items Grid or List */}
        {paginatedItems.length === 0 ? (
          <Empty
            description={`Nenhum ${entityType} encontrado para a busca.`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-6"
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paginatedItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const tagCategory = item.category || item.type || item.priority || 'General';
              const displayName = item.name || item.title || item.id;
              const displayDesc = item.description || item.summary || '';

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`p-3.5 border rounded-lg transition cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-loft-orange bg-[#FFFBF9] shadow-2xs'
                      : 'border-loft-border hover:border-[#CBD2D9] bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-start gap-2.5">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => {}} // Handled by outer card onClick
                          className="mt-0.5 pointer-events-none"
                        />
                        <span className="font-semibold text-xs text-loft-dark leading-snug">
                          {displayName}
                        </span>
                      </div>
                      <Tag color={getTagColor()} className="text-[10px] m-0 shrink-0">
                        {tagCategory}
                      </Tag>
                    </div>

                    {displayDesc && (
                      <p className="text-xs text-loft-muted pl-6 line-clamp-2 leading-relaxed">
                        {displayDesc}
                      </p>
                    )}
                  </div>

                  <div className="pl-6 mt-2 pt-2 border-t border-[#F0F4F8] flex items-center justify-between text-[11px] text-[#9AA5B1]">
                    <span className="font-mono text-[10px] truncate max-w-[140px]">{item.id}</span>
                    {onInspect && (
                      <Button
                        type="link"
                        size="small"
                        icon={<InfoCircleOutlined />}
                        className="text-xs p-0 text-loft-orange"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspect(entityType, item.id);
                        }}
                      >
                        360° Info
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="border border-loft-border rounded-lg divide-y divide-[#F0F4F8] bg-white overflow-hidden">
            {paginatedItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const tagCategory = item.category || item.type || item.priority || 'General';
              const displayName = item.name || item.title || item.id;
              const displayDesc = item.description || item.summary || '';

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`p-3 transition cursor-pointer flex items-center justify-between gap-3 select-none ${
                    isSelected ? 'bg-[#FFFBF9]' : 'hover:bg-[#FAFBFD]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}}
                      className="pointer-events-none shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-loft-dark truncate">
                          {displayName}
                        </span>
                        <Tag color={getTagColor()} className="text-[10px] m-0">
                          {tagCategory}
                        </Tag>
                      </div>
                      {displayDesc && (
                        <p className="text-xs text-loft-muted truncate mt-0.5">
                          {displayDesc}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-[#9AA5B1] hidden md:inline">
                      {item.id}
                    </span>
                    {onInspect && (
                      <Button
                        type="link"
                        size="small"
                        icon={<InfoCircleOutlined />}
                        className="text-xs p-0 text-loft-orange"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspect(entityType, item.id);
                        }}
                      >
                        360°
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination & Footer Counter */}
        {filteredItems.length > pageSize && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F4F8]">
            <span className="text-xs text-loft-muted">
              Mostrando {Math.min(filteredItems.length, (currentPage - 1) * pageSize + 1)}–
              {Math.min(filteredItems.length, currentPage * pageSize)} de {filteredItems.length} {entityType}s
              {searchTerm && ` (filtrados de ${items.length})`}
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredItems.length}
              onChange={(page) => setCurrentPage(page)}
              size="small"
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

"use client"

import { useState, useCallback } from 'react';
import { type Block, type Flexer, type Task, type Station, type FlexerApplication } from '@/app/features/flex/types';

interface UseFlexProps {
  blocks?: Block[];
  flexers?: Flexer[];
  tasks?: Task[];
  stations?: Station[];
  applications?: FlexerApplication[];
}

export function useFlex({ blocks = [], flexers = [], tasks = [], stations = [], applications = [] }: UseFlexProps) {
  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedFlexer, setSelectedFlexer] = useState<Flexer | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<FlexerApplication | null>(null);

  const filteredBlocks = useCallback(() => 
    blocks.filter(block =>
      block.id.toLowerCase().includes(search.toLowerCase()) ||
      block.location.toLowerCase().includes(search.toLowerCase()) ||
      block.flexer?.name.toLowerCase().includes(search.toLowerCase())
    ),
    [blocks, search]
  );

  const filteredFlexers = useCallback(() =>
    flexers.filter(flexer =>
      flexer.name.toLowerCase().includes(search.toLowerCase()) ||
      flexer.id.toLowerCase().includes(search.toLowerCase())
    ),
    [flexers, search]
  );

  const filteredTasks = useCallback(() =>
    tasks.filter(task =>
      task.id.toLowerCase().includes(search.toLowerCase()) ||
      task.address.toLowerCase().includes(search.toLowerCase()) ||
      task.flexer?.name.toLowerCase().includes(search.toLowerCase()) ||
      task.blockId?.toLowerCase().includes(search.toLowerCase())
    ),
    [tasks, search]
  );

  const filteredStations = useCallback(() =>
    stations.filter(station =>
      station.name.toLowerCase().includes(search.toLowerCase()) ||
      station.location.toLowerCase().includes(search.toLowerCase()) ||
      station.managers.some(m => m.name.toLowerCase().includes(search.toLowerCase()))
    ),
    [stations, search]
  );

  const filteredApplications = useCallback(() =>
    applications.filter(app =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.username.toLowerCase().includes(search.toLowerCase()) ||
      app.vehicle.plateNumber.toLowerCase().includes(search.toLowerCase())
    ),
    [applications, search]
  );

  return {
    search,
    setSearch,
    selectedBlock,
    setSelectedBlock,
    selectedFlexer,
    setSelectedFlexer,
    selectedTask,
    setSelectedTask,
    selectedStation,
    setSelectedStation,
    selectedApplication,
    setSelectedApplication,
    filteredBlocks,
    filteredFlexers,
    filteredTasks,
    filteredStations,
    filteredApplications
  };
}
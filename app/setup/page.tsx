'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Player {
  id: string;
  name: string;
  totalScore: number;
}

interface Court {
  id: string;
  name: string;
  order: number;
}

interface CourtAssignment {
  [courtId: string]: Player[];
}

export default function SetupPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [assignments, setAssignments] = useState<CourtAssignment>({ unassigned: [] });
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, courtsRes, sessionsRes] = await Promise.all([
        fetch('/api/players'),
        fetch('/api/courts'),
        fetch('/api/sessions'),
      ]);

      const playersData = await playersRes.json();
      const courtsData = await courtsRes.json();
      const sessionsData = await sessionsRes.json();

      setPlayers(playersData);
      setCourts(courtsData);

      // Find the first pending session
      const firstSession = sessionsData.find((s: any) => s.status === 'pending');
      if (firstSession) {
        setSessionId(firstSession.id);
      }

      // Initialize assignments with unassigned players
      const initialAssignments: CourtAssignment = {
        unassigned: playersData,
      };
      courtsData.forEach((court: Court) => {
        initialAssignments[court.id] = [];
      });
      setAssignments(initialAssignments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceList = [...assignments[source.droppableId]];
    const destList =
      source.droppableId === destination.droppableId
        ? sourceList
        : [...assignments[destination.droppableId]];

    const [movedPlayer] = sourceList.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceList.splice(destination.index, 0, movedPlayer);
      setAssignments({
        ...assignments,
        [source.droppableId]: sourceList,
      });
    } else {
      destList.splice(destination.index, 0, movedPlayer);
      setAssignments({
        ...assignments,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList,
      });
    }
  };

  const startTournament = async () => {
    try {
      // Prepare assignments for API
      const apiAssignments: { [courtId: string]: string[] } = {};
      courts.forEach((court) => {
        if (assignments[court.id] && assignments[court.id].length > 0) {
          apiAssignments[court.id] = assignments[court.id].map((p) => p.id);
        }
      });

      const response = await fetch(`/api/sessions/${sessionId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignments: apiAssignments }),
      });

      if (response.ok) {
        router.push('/display');
      } else {
        alert('Failed to start tournament');
      }
    } catch (error) {
      console.error('Error starting tournament:', error);
      alert('Failed to start tournament');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-2xl font-semibold text-purple-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Setup Tournament - Assign Players to Courts
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {/* Unassigned Players */}
            <Droppable droppableId="unassigned">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl bg-white p-6 shadow-lg transition-all ${
                    snapshot.isDraggingOver ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <h2 className="mb-4 text-xl font-bold text-gray-800">
                    Available Players ({assignments.unassigned.length})
                  </h2>
                  <div className="space-y-2">
                    {assignments.unassigned.map((player, index) => (
                      <Draggable key={player.id} draggableId={player.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 p-3 text-gray-800 transition-all ${
                              snapshot.isDragging ? 'shadow-xl scale-105' : 'shadow'
                            }`}
                          >
                            {player.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>

            {/* Courts */}
            {courts.map((court) => (
              <Droppable key={court.id} droppableId={court.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl bg-white p-6 shadow-lg transition-all ${
                      snapshot.isDraggingOver ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <h2 className="mb-4 text-xl font-bold">
                      <span
                        className={`bg-gradient-to-r ${
                          court.order === 1
                            ? 'from-yellow-500 to-orange-500'
                            : court.order === 2
                            ? 'from-blue-500 to-purple-500'
                            : 'from-green-500 to-teal-500'
                        } bg-clip-text text-transparent`}
                      >
                        {court.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({assignments[court.id]?.length || 0}/10)
                      </span>
                    </h2>
                    <div className="space-y-2">
                      {assignments[court.id]?.map((player, index) => (
                        <Draggable key={player.id} draggableId={player.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`rounded-lg p-3 transition-all ${
                                snapshot.isDragging
                                  ? 'shadow-xl scale-105'
                                  : 'shadow'
                              } ${
                                court.order === 1
                                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800'
                                  : court.order === 2
                                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800'
                                  : 'bg-gradient-to-r from-green-100 to-teal-100 text-teal-800'
                              }`}
                            >
                              {player.name}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startTournament}
            disabled={assignments.unassigned.length > 2}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-12 py-4 text-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Tournament
          </motion.button>
          {assignments.unassigned.length > 2 && (
            <p className="mt-4 text-red-600">
              You must assign players to courts (max 2 can remain on bench)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

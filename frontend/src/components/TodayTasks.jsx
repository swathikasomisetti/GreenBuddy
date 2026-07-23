import "./TodayTasks.css";
import { motion } from "framer-motion";
import {
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiDroplet,
} from "react-icons/fi";

export default function TodayTasks({ events }) {
  const overdue = events.filter(
    (e) => e.status === "OVERDUE"
  );

  const today = events.filter(
    (e) => e.status === "TODAY"
  );

  const upcoming = events.filter(
    (e) => e.status === "UPCOMING"
  );

  const renderTask = (task) => (
    <div
      key={`${task.plantId}-${task.title}`}
      className="taskCard"
      style={{
        borderLeft: `5px solid ${task.color}`,
      }}
    >
      <div className="taskHeader">
        <h4>{task.title}</h4>

        <span
          className={`status ${task.status.toLowerCase()}`}
        >
          {task.status}
        </span>
      </div>

      <div className="taskInfo">
        <FiDroplet />

        <span>{task.eventType}</span>
      </div>

      <div className="taskDate">
        <FiClock />

        <span>{task.start}</span>
      </div>
    </div>
  );

  return (
    <motion.section
      className="todayTasks"
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="taskTitle">
        <h2>Today's Care Tasks</h2>

        <p>Keep your plants happy and healthy.</p>
      </div>

      {overdue.length > 0 && (
        <>
          <div className="taskHeading danger">
            <FiAlertTriangle />
            Overdue
          </div>

          {overdue.map(renderTask)}
        </>
      )}

      {today.length > 0 && (
        <>
          <div className="taskHeading primary">
            <FiClock />
            Today
          </div>

          {today.map(renderTask)}
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="taskHeading success">
            <FiCheckCircle />
            Upcoming
          </div>

          {upcoming.slice(0, 4).map(renderTask)}
        </>
      )}

      {events.length === 0 && (
        <div className="emptyTasks">
          🌿 Everything is completed.

          <p>No pending care reminders.</p>
        </div>
      )}
    </motion.section>
  );
}
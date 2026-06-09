import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database.js';

const router = Router();

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await DatabaseService.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await DatabaseService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.patch('/projects/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const project = await DatabaseService.updateProjectStatus(parseInt(req.params.id), status);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ error: 'Failed to update project status' });
  }
});

router.delete('/projects/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await DatabaseService.deleteProject(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;

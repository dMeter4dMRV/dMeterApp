import { Router, Request, Response } from 'express';
import { DMeterSeiClient } from '../network/seiClient';
import { EnvironmentalData } from '../types/environmental';

const router = Router();
const seiClient = new DMeterSeiClient();

// Submit environmental data
router.post('/data', async (req: Request, res: Response) => {
  try {
    const data: EnvironmentalData = req.body;
    const txHash = await seiClient.submitEnvironmentalData(data);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get environmental data by ID
router.get('/data/:id', async (req: Request, res: Response) => {
  try {
    const data = await seiClient.getEnvironmentalData(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get environmental data by location
router.get('/location/:location', async (req: Request, res: Response) => {
  try {
    // Implementation for getting data by location
    res.status(501).json({ 
      success: false, 
      error: 'Not implemented yet' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get environmental data by type
router.get('/type/:type', async (req: Request, res: Response) => {
  try {
    // Implementation for getting data by type
    res.status(501).json({ 
      success: false, 
      error: 'Not implemented yet' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export const environmentalRoutes = router; 
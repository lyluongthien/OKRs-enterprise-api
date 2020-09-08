import { JobService } from '../job.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
describe('UT JOB service', () => {
  let jobservice: JobService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    jobservice = module.get<JobService>(JobService);
  });

  it('Get list job', async () => {
    const res = await jobservice.getJobDetail(1);
    expect(res.statusCode).toEqual(200);
  });

  let jobId: number;
  it('Create job', async () => {
    const res = await jobservice.createJob({ name: 'asdasd asdasd' });
    expect(res).toBeDefined();
    expect(res.statusCode).toEqual(201);
    jobId = res.data.id;
  });

  it('Delete job', async () => {
    const res = await jobservice.deleteJob(jobId);
    expect(res).toBeDefined();
    expect(res.statusCode).toEqual(200);
  });
});

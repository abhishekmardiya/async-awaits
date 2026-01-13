import { JobCard } from "@/components/cards/JobCard";
import { JobsFilter } from "@/components/filters/JobFilter";
import { Pagination } from "@/components/Pagination";
import { fetchJobs, fetchLocation } from "@/lib/actions/job.action";

const Page = async ({ searchParams }: RouteParams) => {
  const { query = "", location = "", page = "1" } = await searchParams;
  const parsedPage = parseInt(page, 10);

  const { data: userLocation } = await fetchLocation();
  const finalLocation = location || userLocation || "India";

  const { data: jobs } = await fetchJobs({
    query: query
      ? `${query}, ${finalLocation}`
      : `Software Engineer in ${finalLocation}`,
    page: page ?? 1,
  });

  console.log(
    "jobs",
    jobs?.map((job: Job) => job?.job_id)
  );

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobsFilter />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {jobs?.length ? (
          jobs
            ?.filter((job: Job) => job.job_title)
            .map((job: Job) => <JobCard key={job.job_id} job={job} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </div>
        )}
      </section>

      {!!jobs?.length && (
        <Pagination page={parsedPage} isNext={jobs?.length === 10} />
      )}
    </>
  );
};

export default Page;

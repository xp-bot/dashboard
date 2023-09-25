import BlogMarkdown from 'components/blog-markdown';
import HeadSet from 'components/head-set';
import { useLayout } from 'context/layout-context';
import { IPage } from 'models/page';
import type { NextPage } from 'next';
import { useEffect } from 'react';

type NotFoundPageProps = IPage
const NotFoundPage: NextPage<NotFoundPageProps> = () => {
  const layout = useLayout();
  useEffect(() => {
    layout.changeHeader(
      <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
        <h1>Privacy Agreement</h1>
        <h4>This is what we do with your data.</h4>
      </div>,
      `privacy`
    );
  }, []);
  return (
    <>
      <HeadSet title="This is your User Profile" />
      <BlogMarkdown
        body={` # Privacy Agreement[^1]
        
## User Agreement (1)  
By using the XP Discord Bot (“Bot” “XP” “Product” “Service”) and its website you are agreeing to our privacy policy and its contents.
You can opt-out at any point, and we make sure this option is available to everyone at any given time. For more info, contact our Support via Mail at support@namespace.media.


## Data Collection (2)  
To provide this Service properly, we’re logging some data, that must not be sensitive to the end-user.
To categorize the data we’re logging, we split them into the following categories:
- Required Data
This contains data, that is essential for running the Bot as a service, such as Discord User IDs, Discord Avatars, Discord Server IDs, etc.

- Optional Data
This category contains data such as command usages, Discord Server sizes, Page visits, XP Gains per User, and several other information about our official support Discord Server. We understand that this kind of data
might be sensitive to some users. Therefore, we are collecting this information without any way of connecting a specific user to it. That means, it is completely anonymized. Data like this is kept for creating predictions and
statistics about the growth and usage of our Service, so we can prepare scaling and upgrades for technologies in advance, which guarantees a much higher uptime and reliability of the product.


## Cookies (3) 
Cookie Identifiers are used to create statistics and predictions of the overall website usage. This again helps us to scale at time. This data is also fully anonymous and must not be connected to a user or device.


## Data Management (4)
   1. Third Parties  
With this policy, we commit ourselves to never sell or send data to third parties and won’t ever take advantage of data for commercial purposes.

   2. Deletion of Data  
All the data stored about a user will only exist for the exact amount of time we need it for. If you want to get your data deleted, contact our Support via Mail at support@namespace.media at any time.

[^1]: Latest Privacy Policy update on Jan. 15th, 2022.  
      We reserve the right to change or modify any policy or guideline at any time and in our sole discretion.`}
      />
    </>
  );
};

export default NotFoundPage;

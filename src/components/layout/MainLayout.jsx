// components/layout/MainLayout.jsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BiographyList from '../admin/biographies/BiographyList';
import BiographyForm from '../admin/biographies/BiographyForm';
import BiographyDetail from '../admin/biographies/BiographyDetail';
import BiographyEditWrapper from '../admin/biographies/BiographyEditWrapper';
import SectionList from '../admin/sections/SectionList';
import SectionForm from '../admin/sections/SectionForm';
import SectionDetail from '../admin/sections/SectionDetail';
import SectionEditWrapper from '../admin/sections/SectionEditWrapper';
import PublicationList from '../admin/publications/PublicationList';
import PublicationForm from '../admin/publications/PublicationForm';
import PublicationDetail from '../admin/publications/PublicationDetail';
import PublicationEditWrapper from '../admin/publications/PublicationEditWrapper';

const MainLayout = () => {
 return (
   <div className="h-screen flex overflow-hidden bg-gray-100">
     <Sidebar />
     <div className="flex flex-col w-0 flex-1 overflow-hidden">
       <Header />
       <main className="flex-1 relative overflow-y-auto focus:outline-none">
         <div className="py-6">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
             <Routes>
               <Route path="sections" element={<SectionList />} />
               <Route path="sections/new" element={<SectionForm />} />
               <Route path="sections/:id" element={<SectionDetail />} />
               <Route path="sections/edit/:id" element={<SectionEditWrapper />} />

               <Route path="publications" element={<PublicationList />} />
               <Route path="publications/new" element={<PublicationForm />} />
               <Route path="publications/:id" element={<PublicationDetail />} />
               <Route path="publications/edit/:id" element={<PublicationEditWrapper />} />

               <Route path="biographies" element={<BiographyList />} />
               <Route path="biographies/new" element={<BiographyForm />} />
               <Route path="biographies/:id" element={<BiographyDetail />} />
               <Route path="biographies/edit/:id" element={<BiographyEditWrapper />} />
             </Routes>
           </div>
         </div>
       </main>
     </div>
   </div>
 );
};

export default MainLayout;
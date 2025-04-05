"use strict";(self.webpackChunkopendal_website=self.webpackChunkopendal_website||[]).push([[8515],{3209:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>i,toc:()=>d});var i=t(6200),s=t(6070),r=t(5658);const a={title:"Apache OpenDAL\u2122 Internal: Data Reading",date:new Date("2023-08-15T00:00:00.000Z"),slug:"how-opendal-read-data",tags:["internal"],description:"The first article will discuss OpenDAL's most commonly used data reading function. I will start from the outermost interface and then gradually unfold according to the calling sequence of OpenDAL.",authors:"xuanwo"},o=void 0,l={authorsImageUrls:[void 0]},d=[{value:"Overall Framework",id:"overall-framework",level:2},{value:"Operator",id:"operator",level:2},{value:"Layers",id:"layers",level:2},{value:"Services",id:"services",level:2},{value:"Service fs",id:"service-fs",level:3},{value:"Services s3",id:"services-s3",level:3},{value:"Conclusion",id:"conclusion",level:2}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"As the Apache OpenDAL\u2122 community continues to grow, new abstractions are constantly being added, which has brought some burdens to new contributors participating in development. Many maintainers hope to have a deeper understanding of OpenDAL's internal implementation. At the same time, OpenDAL's core design has not changed significantly for a long time, making it possible to write a series on internal implementation. I believe now is the time to write a series of articles on OpenDAL's internal implementation, to explain from the maintainer's perspective how OpenDAL is designed, implemented, and how it can be expanded. With the impending release of OpenDAL v0.40, I hope this series of articles will better help the community understand the past, master the present, and shape the future."}),"\n",(0,s.jsx)(n.p,{children:"The first article will discuss OpenDAL's most commonly used data reading function. I will start from the outermost interface and then gradually unfold according to the calling sequence of OpenDAL. Let's get started!"}),"\n",(0,s.jsx)(n.h2,{id:"overall-framework",children:"Overall Framework"}),"\n",(0,s.jsx)(n.p,{children:"Before starting to introduce the specific OpenDAL interface, let's first get familiar with the OpenDAL project."}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://github.com/apache/opendal",children:"OpenDAL"})," is an Apache Incubator project aimed at helping users access data from various storage services in a unified, convenient, and efficient way. Its project ",(0,s.jsx)(n.a,{href:"https://opendal.apache.org/vision",children:"vision"}),' is "free access to data":']}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Free from services: Any service can be accessed freely through native interfaces"}),"\n",(0,s.jsx)(n.li,{children:"Free from implementations: No matter how the underlying implementation is, it can be called in a unified way"}),"\n",(0,s.jsx)(n.li,{children:"Free to integrate: Able to freely integrate with various services and languages"}),"\n",(0,s.jsx)(n.li,{children:"Free to zero cost: Users don't have to pay for features they don't use"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"On this philosophical foundation, OpenDAL Rust Core can be mainly divided into the following components:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Operator: The outer interface exposed to users"}),"\n",(0,s.jsx)(n.li,{children:"Layers: Specific implementation of different middleware"}),"\n",(0,s.jsx)(n.li,{children:"Services: Specific implementation of different services"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"From a macroscopic perspective, OpenDAL's data reading call stack would look like this:"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:t(6109).A+"",width:"1238",height:"968"})}),"\n",(0,s.jsx)(n.p,{children:"All Layers and Services have implemented a unified Accessor interface, erasing all type information when building the Operator. For the Operator, regardless of what services are used or how many middleware are added, all call logic is consistent. This design splits OpenDAL's API into Public API and Raw API, where the Public API is directly exposed to users, providing convenient top-level interfaces, and Raw API is provided to OpenDAL internal developers, maintaining a unified internal interface and providing some convenient implementation."}),"\n",(0,s.jsx)(n.h2,{id:"operator",children:"Operator"}),"\n",(0,s.jsxs)(n.p,{children:["OpenDAL's Operator API will adhere to a consistent calling paradigm as much as possible, reducing users' learning and usage costs. For example, OpenDAL offers the following APIs for ",(0,s.jsx)(n.code,{children:"read"}),":"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"op.read(path)"}),": Reads the entire content of the specified file"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"op.reader(path)"}),": Creates a Reader for streaming reading"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"op.read_with(path).range(1..1024)"}),": Reads file content using specified parameters, such as range"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"op.reader_with(path).range(1..1024)"}),": Creates a Reader for streaming reading with specified parameters"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["It's not hard to see that ",(0,s.jsx)(n.code,{children:"read"})," is more like syntactic sugar, allowing users to quickly read files without considering various traits like ",(0,s.jsx)(n.code,{children:"AsyncRead"}),". The ",(0,s.jsx)(n.code,{children:"reader"})," provides more flexibility, implementing widely-used community traits like ",(0,s.jsx)(n.code,{children:"AsyncSeek"}),", ",(0,s.jsx)(n.code,{children:"AsyncRead"}),", allowing more flexible data reading. ",(0,s.jsx)(n.code,{children:"read_with"})," and ",(0,s.jsx)(n.code,{children:"reader_with"})," assist users in specifying various parameters in a more natural way through Future Builder functions."]}),"\n",(0,s.jsx)(n.p,{children:"The internal logic of the Operator would look like this:"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{src:t(2342).A+"",width:"1628",height:"1006"})}),"\n",(0,s.jsx)(n.p,{children:"Its main job is to encapsulate the interface for the user:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Completing the construction of ",(0,s.jsx)(n.code,{children:"OpRead"}),": the args for read operation."]}),"\n",(0,s.jsxs)(n.li,{children:["Calling the ",(0,s.jsx)(n.code,{children:"read"})," function provided by ",(0,s.jsx)(n.code,{children:"Accessor"})]}),"\n",(0,s.jsxs)(n.li,{children:["Wrapping the returned value as ",(0,s.jsx)(n.code,{children:"Reader"})," and implementing interfaces like ",(0,s.jsx)(n.code,{children:"AsyncSeek"}),", ",(0,s.jsx)(n.code,{children:"AsyncRead"}),", etc., based on ",(0,s.jsx)(n.code,{children:"Reader"})]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"layers",children:"Layers"}),"\n",(0,s.jsx)(n.p,{children:"A little secret here is that OpenDAL will automatically apply some Layers to the Service to implement some internal logic. As of the completion of this article, OpenDAL's automatically added Layers include:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"ErrorContextLayer"}),": Injects context information, such as ",(0,s.jsx)(n.code,{children:"scheme"}),", ",(0,s.jsx)(n.code,{children:"path"}),", etc., into all returned errors of Operation"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"CompleteLayer"}),": Adds necessary capabilities to services, such as adding seek support to s3"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"TypeEraseLayer"}),": Implements type erasure, uniformly erasing associated types in ",(0,s.jsx)(n.code,{children:"Accessor"}),", so users don't need to carry generic parameters when using it"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Here, ",(0,s.jsx)(n.code,{children:"ErrorContextLayer"})," and ",(0,s.jsx)(n.code,{children:"TypeEraseLayer"})," are relatively simple and won't be elaborated on. The focus is on ",(0,s.jsx)(n.code,{children:"CompleteLayer"}),", aimed at adding ",(0,s.jsx)(n.code,{children:"seek"})," or ",(0,s.jsx)(n.code,{children:"next"})," support to OpenDAL's returned ",(0,s.jsx)(n.code,{children:"Reader"})," in a zero-cost way, so users don't have to re-implement it. OpenDAL initially returned ",(0,s.jsx)(n.code,{children:"Reader"})," and ",(0,s.jsx)(n.code,{children:"SeekableReader"})," through different function calls in early versions, but the actual user feedback was not very good; almost all users were using ",(0,s.jsx)(n.code,{children:"SeekableReader"}),". Therefore, OpenDAL subsequently added seek support as the first priority to the internal ",(0,s.jsx)(n.code,{children:"Read"})," trait during the refactor:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"pub trait Read: Unpin + Send + Sync {\n    /// Read bytes asynchronously.\n    fn poll_read(&mut self, cx: &mut Context<'_>, buf: &mut [u8]) -> Poll<Result<usize>>;\n\n    /// Seek asynchronously.\n    ///\n    /// Returns `Unsupported` error if underlying reader doesn't support seek.\n    fn poll_seek(&mut self, cx: &mut Context<'_>, pos: io::SeekFrom) -> Poll<Result<u64>>;\n\n    /// Stream [`Bytes`] from underlying reader.\n    ///\n    /// Returns `Unsupported` error if underlying reader doesn't support stream.\n    ///\n    /// This API exists for avoiding bytes copying inside async runtime.\n    /// Users can poll bytes from underlying reader and decide when to\n    /// read/consume them.\n    fn poll_next(&mut self, cx: &mut Context<'_>) -> Poll<Option<Result<Bytes>>>;\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"To implement a service's reading capability in OpenDAL, one needs to implement this trait, which is an internal interface and will not be directly exposed to users. Among them:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"poll_read"})," is the most basic requirement; all services must implement this interface."]}),"\n",(0,s.jsxs)(n.li,{children:["When the service natively supports ",(0,s.jsx)(n.code,{children:"seek"}),", ",(0,s.jsx)(n.code,{children:"poll_seek"})," can be implemented, and OpenDAL will correctly dispatch, such as local fs;"]}),"\n",(0,s.jsxs)(n.li,{children:["When the service natively supports ",(0,s.jsx)(n.code,{children:"next"}),", meaning it returns streaming Bytes, ",(0,s.jsx)(n.code,{children:"poll_next"})," can be implemented, like HTTP-based services, where the underlying layer is a TCP Stream, and hyper will encapsulate it as a bytes stream."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Through the ",(0,s.jsx)(n.code,{children:"Read"})," trait, OpenDAL ensures that all services can expose their native support capabilities as much as possible, thereby achieving efficient reading for different services."]}),"\n",(0,s.jsx)(n.p,{children:"Based on this trait, OpenDAL will complete according to the capabilities supported by each service:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Both seek/next are supported: Direct return"}),"\n",(0,s.jsxs)(n.li,{children:["No support for next: Encapsulate using ",(0,s.jsx)(n.code,{children:"StreamableReader"})," to simulate next support"]}),"\n",(0,s.jsxs)(n.li,{children:["No support for seek: Encapsulate using ",(0,s.jsx)(n.code,{children:"ByRangeSeekableReader"})," to simulate seek support"]}),"\n",(0,s.jsx)(n.li,{children:"Neither seek/next supported: Encapsulate using both methods"}),"\n"]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"ByRangeSeekableReader"})," mainly utilizes the service's ability to support range read, dropping the current reader when the user seeks and initiating a new request at the specified location."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["OpenDAL exposes a unified Reader implementation through ",(0,s.jsx)(n.code,{children:"CompleteLayer"}),", so users don't have to worry about whether the underlying service supports seek; OpenDAL will always choose the optimal way to initiate the request."]}),"\n",(0,s.jsx)(n.h2,{id:"services",children:"Services"}),"\n",(0,s.jsxs)(n.p,{children:["After the completion of the Layers, it's time to call the specific implementation of the Service. Here, the most common services ",(0,s.jsx)(n.code,{children:"fs"})," and ",(0,s.jsx)(n.code,{children:"s3"})," are used as examples to explain how data is read."]}),"\n",(0,s.jsx)(n.h3,{id:"service-fs",children:"Service fs"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"tokio::fs::File"})," implements ",(0,s.jsx)(n.code,{children:"tokio::AsyncRead"})," and ",(0,s.jsx)(n.code,{children:"tokio::AsyncSeek"}),". Using ",(0,s.jsx)(n.code,{children:"async_compat::Compat"}),", we have transformed it into ",(0,s.jsx)(n.code,{children:"futures::AsyncRead"})," and ",(0,s.jsx)(n.code,{children:"futures::AsyncSeek"}),". Based on this, we provide a built-in function ",(0,s.jsx)(n.code,{children:"oio::into_read_from_file"})," to transform it into a type that implements ",(0,s.jsx)(n.code,{children:"oio::Read"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["There's nothing particularly complex in the implementation of ",(0,s.jsx)(n.code,{children:"oio::into_read_from_file"}),"; read and seek are mostly calling the functions provided by the incoming File type. The tricky part is about the correct handling of seek and range: seeking to the right side of the range is allowed, and this will not cause an error, and reading will only return empty, but seeking to the left side of the range is illegal, and the Reader must return ",(0,s.jsx)(n.code,{children:"InvalidInput"})," for proper upper-level handling."]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Interesting history: there was ",(0,s.jsx)(n.a,{href:"https://github.com/apache/opendal/issues/2717",children:"an issue"})," in the initial implementation of this part, discovered during fuzz testing."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"services-s3",children:"Services s3"}),"\n",(0,s.jsxs)(n.p,{children:["S3 is an HTTP-based service, and opendal provides a lot of HTTP-based wrappers to help developers reuse logic; they only need to build a request and return a well-constructed Body. OpenDAL Raw API encapsulates a set of reqwest-based interfaces, and the HTTP GET interface returns a ",(0,s.jsx)(n.code,{children:"Response<IncomingAsyncBody>"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"/// IncomingAsyncBody carries the content returned by remote servers.\npub struct IncomingAsyncBody {\n    /// # TODO\n    ///\n    /// hyper returns `impl Stream<Item = crate::Result<Bytes>>` but we can't\n    /// write the types in stable. So we will box here.\n    ///\n    /// After [TAIT](https://rust-lang.github.io/rfcs/2515-type_alias_impl_trait.html)\n    /// has been stable, we can change `IncomingAsyncBody` into `IncomingAsyncBody<S>`.\n    inner: oio::Streamer,\n    size: Option<u64>,\n    consumed: u64,\n    chunk: Option<Bytes>,\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"The stream contained in this body is the bytes stream returned by reqwest, and opendal implements content length checks and read support on this basis."}),"\n",(0,s.jsxs)(n.p,{children:["Here's an extra note about a small pitfall with reqwest/hyper: reqwest and hyper do not check the returned content length, so an illegal server may return a data volume that does not match the expected content length instead of an error, leading to unexpected data behavior. OpenDAL specifically added checks here, returning ",(0,s.jsx)(n.code,{children:"ContentIncomplete"})," when data is insufficient and ",(0,s.jsx)(n.code,{children:"ContentTruncated"})," when data exceeds expectations, avoiding users receiving illegal data."]}),"\n",(0,s.jsx)(n.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,s.jsx)(n.p,{children:"This article introduces from top to bottom how OpenDAL implements data reading:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Operator is responsible for exposing user-friendly interfaces"}),"\n",(0,s.jsx)(n.li,{children:"Layers are responsible for completing the capabilities of the services"}),"\n",(0,s.jsx)(n.li,{children:"Services are responsible for the specific implementation of different services"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Throughout the entire chain, OpenDAL adheres as much as possible to the principle of zero cost, prioritizing the use of native service capabilities, then considering simulation through other methods, and finally returning unsupported errors. Through this three-tier design, users don't need to understand the details of the underlying service, nor do they need to integrate different service SDKs to easily call ",(0,s.jsx)(n.code,{children:"op.read(path)"})," to access data in any storage service."]}),"\n",(0,s.jsxs)(n.p,{children:["This is: How ",(0,s.jsx)(n.strong,{children:"OpenDAL"})," read data freely!"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},6109:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/1-0b02956a3da2b4329eab11ea4779711c.png"},2342:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/2-3b83ca1ebfbdd77770566a80131846bd.png"},5658:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>o});var i=t(758);const s={},r=i.createContext(s);function a(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(r.Provider,{value:n},e.children)}},6200:e=>{e.exports=JSON.parse('{"permalink":"/blog/how-opendal-read-data","editUrl":"https://github.com/apache/opendal/tree/main/website/blog/2023-08-15-how-opendal-read-data/index.md","source":"@site/blog/2023-08-15-how-opendal-read-data/index.md","title":"Apache OpenDAL\u2122 Internal: Data Reading","description":"The first article will discuss OpenDAL\'s most commonly used data reading function. I will start from the outermost interface and then gradually unfold according to the calling sequence of OpenDAL.","date":"2023-08-15T00:00:00.000Z","tags":[{"inline":true,"label":"internal","permalink":"/blog/tags/internal"}],"readingTime":7.97,"hasTruncateMarker":true,"authors":[{"name":"Xuanwo","url":"https://github.com/Xuanwo","key":"xuanwo","page":null}],"frontMatter":{"title":"Apache OpenDAL\u2122 Internal: Data Reading","date":"2023-08-15T00:00:00.000Z","slug":"how-opendal-read-data","tags":["internal"],"description":"The first article will discuss OpenDAL\'s most commonly used data reading function. I will start from the outermost interface and then gradually unfold according to the calling sequence of OpenDAL.","authors":"xuanwo"},"unlisted":false,"prevItem":{"title":"OwO #1: The v0.40 Release","permalink":"/blog/owo-1"},"nextItem":{"title":"Apache OpenDAL\u2122: Access Data Freely","permalink":"/blog/opendal-access-data-freely"}}')}}]);
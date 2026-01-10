--
-- PostgreSQL database dump
--

\restrict iT1JwgmUdxfOi6ThujDmk4LniETtAhDaFAnctLsHIdXYp2CGASEraCU0A7bkkPJ

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Court; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public."Court" (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Court" OWNER TO karimarnous;

--
-- Name: CourtAssignment; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public."CourtAssignment" (
    id text NOT NULL,
    "courtSessionId" text NOT NULL,
    "playerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CourtAssignment" OWNER TO karimarnous;

--
-- Name: CourtSession; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public."CourtSession" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "courtId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CourtSession" OWNER TO karimarnous;

--
-- Name: Game; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public."Game" (
    id text NOT NULL,
    "courtSessionId" text NOT NULL,
    "gameNumber" integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Game" OWNER TO karimarnous;

--
-- Name: GamePlayer; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public."GamePlayer" (
    id text NOT NULL,
    "gameId" text NOT NULL,
    "playerId" text NOT NULL,
    team integer NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GamePlayer" OWNER TO karimarnous;

--
-- Name: Player; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public."Player" (
    id text NOT NULL,
    name text NOT NULL,
    "totalScore" integer DEFAULT 0 NOT NULL,
    "isOnBench" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Player" OWNER TO karimarnous;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionNumber" integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Session" OWNER TO karimarnous;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: karimarnous
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO karimarnous;

--
-- Data for Name: Court; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public."Court" (id, name, "order", "createdAt") FROM stdin;
cmk7xfm200000l1lu50fu2ehh	Championship	1	2026-01-10 06:31:15.816
cmk7xfm240001l1luhivj53lt	Challenger	2	2026-01-10 06:31:15.821
cmk7xfm250002l1luk842f3ho	Development	3	2026-01-10 06:31:15.821
\.


--
-- Data for Name: CourtAssignment; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public."CourtAssignment" (id, "courtSessionId", "playerId", "createdAt") FROM stdin;
cmk7xfm2n0016l1lugqbyocox	cmk7xfm2k0014l1luonps677i	cmk7xfm2b000dl1lum8ex61mr	2026-01-10 06:31:15.839
cmk7xfm2o0018l1luhc9h8lc5	cmk7xfm2k0014l1luonps677i	cmk7xfm2a000al1luwosx12es	2026-01-10 06:31:15.84
cmk7xfm2o001al1luyd2g10ay	cmk7xfm2k0014l1luonps677i	cmk7xfm2b000cl1lu9o5w6fm9	2026-01-10 06:31:15.841
cmk7xfm2p001cl1lue33lvv2p	cmk7xfm2k0014l1luonps677i	cmk7xfm280007l1lufz7tc5rx	2026-01-10 06:31:15.841
cmk7xfm2p001el1lurq316xnk	cmk7xfm2k0014l1luonps677i	cmk7xfm2g000wl1luay9f1btv	2026-01-10 06:31:15.842
cmk7xfm2q001gl1lu2le3hisw	cmk7xfm2k0014l1luonps677i	cmk7xfm2e000nl1luw23vr8uz	2026-01-10 06:31:15.842
cmk7xfm2q001il1lumqflv9sj	cmk7xfm2k0014l1luonps677i	cmk7xfm2d000ml1lud984zkw0	2026-01-10 06:31:15.843
cmk7xfm2r001kl1lu5uat5wrv	cmk7xfm2k0014l1luonps677i	cmk7xfm2b000el1luvjrbtjph	2026-01-10 06:31:15.843
cmk7xfm2r001ml1lu8qh5daoc	cmk7xfm2k0014l1luonps677i	cmk7xfm290009l1lujrsebu2c	2026-01-10 06:31:15.844
cmk7xfm2s001ol1lu7k8s1834	cmk7xfm2k0014l1luonps677i	cmk7xfm2f000sl1luhvkis23y	2026-01-10 06:31:15.844
cmk7xfm34002ml1lukw97x43d	cmk7xfm34002kl1lu3yivlnus	cmk7xfm270004l1lu6i23vjk6	2026-01-10 06:31:15.857
cmk7xfm35002ol1lu40spp8l7	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2c000il1lu5jpdk8n3	2026-01-10 06:31:15.857
cmk7xfm35002ql1lu64zmq95q	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2c000gl1luv8xa3jec	2026-01-10 06:31:15.858
cmk7xfm36002sl1luz6raa57y	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2d000jl1luvga15tsh	2026-01-10 06:31:15.858
cmk7xfm36002ul1lusv96gr1e	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2d000kl1lu9j0k99ri	2026-01-10 06:31:15.859
cmk7xfm36002wl1luaqqce9kw	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2e000pl1luzlmrj46o	2026-01-10 06:31:15.859
cmk7xfm37002yl1lujqno1vzt	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2h000yl1luw7x5vsk6	2026-01-10 06:31:15.859
cmk7xfm370030l1lumh2xsoc8	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2e000ol1luvard19cg	2026-01-10 06:31:15.86
cmk7xfm380032l1lu15ottuf7	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2i000zl1lu7vs5skw3	2026-01-10 06:31:15.86
cmk7xfm380034l1lud5wx20g4	cmk7xfm34002kl1lu3yivlnus	cmk7xfm2d000ll1lulsa3l4rv	2026-01-10 06:31:15.86
cmk7xfm3e0042l1lukxr4b5en	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2g000ul1lud89p2ndp	2026-01-10 06:31:15.867
cmk7xfm3f0044l1lud9xlphlb	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2f000tl1luozi486qq	2026-01-10 06:31:15.867
cmk7xfm3f0046l1lundytj9g5	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2a000bl1lumtdvb6k8	2026-01-10 06:31:15.868
cmk7xfm3g0048l1luuydv3cqj	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2c000fl1lu96b329or	2026-01-10 06:31:15.868
cmk7xfm3g004al1luqpxolzvk	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2c000hl1lun88pe3uq	2026-01-10 06:31:15.868
cmk7xfm3g004cl1lu0l8g0mea	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm260003l1lul3jayxot	2026-01-10 06:31:15.869
cmk7xfm3h004el1lu9ql73y0k	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2h000xl1luhlszmdqn	2026-01-10 06:31:15.869
cmk7xfm3h004gl1lucpepiybo	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2g000vl1lubzhk5rdd	2026-01-10 06:31:15.87
cmk7xfm3h004il1luagmaa1qw	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2e000ql1lu4671jd8r	2026-01-10 06:31:15.87
cmk7xfm3i004kl1lu48id4pv7	cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2f000rl1lurl0tp65a	2026-01-10 06:31:15.87
\.


--
-- Data for Name: CourtSession; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public."CourtSession" (id, "sessionId", "courtId", "createdAt") FROM stdin;
cmk7xfm2k0014l1luonps677i	cmk7xfm2i0010l1ludztl0cu8	cmk7xfm200000l1lu50fu2ehh	2026-01-10 06:31:15.836
cmk7xfm34002kl1lu3yivlnus	cmk7xfm2i0010l1ludztl0cu8	cmk7xfm240001l1luhivj53lt	2026-01-10 06:31:15.856
cmk7xfm3e0040l1luwyq12d4p	cmk7xfm2i0010l1ludztl0cu8	cmk7xfm250002l1luk842f3ho	2026-01-10 06:31:15.866
\.


--
-- Data for Name: Game; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public."Game" (id, "courtSessionId", "gameNumber", status, "createdAt") FROM stdin;
cmk7xfm2u001ql1lupwommssi	cmk7xfm2k0014l1luonps677i	1	pending	2026-01-10 06:31:15.846
cmk7xfm2z001wl1lux3ld18tw	cmk7xfm2k0014l1luonps677i	2	pending	2026-01-10 06:31:15.851
cmk7xfm310022l1luyyvei3og	cmk7xfm2k0014l1luonps677i	3	pending	2026-01-10 06:31:15.853
cmk7xfm310028l1lu34xvhg14	cmk7xfm2k0014l1luonps677i	4	pending	2026-01-10 06:31:15.854
cmk7xfm33002el1lu30z3v0kw	cmk7xfm2k0014l1luonps677i	5	pending	2026-01-10 06:31:15.855
cmk7xfm380036l1lugq8gg8di	cmk7xfm34002kl1lu3yivlnus	1	pending	2026-01-10 06:31:15.861
cmk7xfm3a003cl1lug3axjtn4	cmk7xfm34002kl1lu3yivlnus	2	pending	2026-01-10 06:31:15.862
cmk7xfm3b003il1luh8lve11u	cmk7xfm34002kl1lu3yivlnus	3	pending	2026-01-10 06:31:15.864
cmk7xfm3c003ol1luvr63xlrc	cmk7xfm34002kl1lu3yivlnus	4	pending	2026-01-10 06:31:15.864
cmk7xfm3d003ul1luvncewskh	cmk7xfm34002kl1lu3yivlnus	5	pending	2026-01-10 06:31:15.865
cmk7xfm3i004ml1lu7q35eaix	cmk7xfm3e0040l1luwyq12d4p	1	pending	2026-01-10 06:31:15.871
cmk7xfm3j004sl1lub3flm5i9	cmk7xfm3e0040l1luwyq12d4p	2	pending	2026-01-10 06:31:15.872
cmk7xfm3l004yl1luj7zgbuk6	cmk7xfm3e0040l1luwyq12d4p	3	pending	2026-01-10 06:31:15.873
cmk7xfm3m0054l1luo5f3fvrb	cmk7xfm3e0040l1luwyq12d4p	4	pending	2026-01-10 06:31:15.874
cmk7xfm3m005al1lu6cnffvj8	cmk7xfm3e0040l1luwyq12d4p	5	pending	2026-01-10 06:31:15.875
\.


--
-- Data for Name: GamePlayer; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public."GamePlayer" (id, "gameId", "playerId", team, score, "createdAt") FROM stdin;
cmk7xfm2v001rl1ludc4nr4kb	cmk7xfm2u001ql1lupwommssi	cmk7xfm2b000dl1lum8ex61mr	1	0	2026-01-10 06:31:15.848
cmk7xfm2v001sl1luygtpppaf	cmk7xfm2u001ql1lupwommssi	cmk7xfm2a000al1luwosx12es	1	0	2026-01-10 06:31:15.848
cmk7xfm2v001tl1luno5no19r	cmk7xfm2u001ql1lupwommssi	cmk7xfm2b000cl1lu9o5w6fm9	2	0	2026-01-10 06:31:15.848
cmk7xfm2v001ul1luxdechuis	cmk7xfm2u001ql1lupwommssi	cmk7xfm280007l1lufz7tc5rx	2	0	2026-01-10 06:31:15.848
cmk7xfm2z001xl1luakewhjt9	cmk7xfm2z001wl1lux3ld18tw	cmk7xfm2g000wl1luay9f1btv	1	0	2026-01-10 06:31:15.852
cmk7xfm2z001yl1lu0p68mk4q	cmk7xfm2z001wl1lux3ld18tw	cmk7xfm2e000nl1luw23vr8uz	1	0	2026-01-10 06:31:15.852
cmk7xfm2z001zl1lusn8bn7at	cmk7xfm2z001wl1lux3ld18tw	cmk7xfm2d000ml1lud984zkw0	2	0	2026-01-10 06:31:15.852
cmk7xfm2z0020l1lugo07u3v7	cmk7xfm2z001wl1lux3ld18tw	cmk7xfm2b000el1luvjrbtjph	2	0	2026-01-10 06:31:15.852
cmk7xfm310023l1luhbtf8ngd	cmk7xfm310022l1luyyvei3og	cmk7xfm290009l1lujrsebu2c	1	0	2026-01-10 06:31:15.853
cmk7xfm310024l1lug5skyyhh	cmk7xfm310022l1luyyvei3og	cmk7xfm2f000sl1luhvkis23y	1	0	2026-01-10 06:31:15.853
cmk7xfm310025l1lualdpe7zp	cmk7xfm310022l1luyyvei3og	cmk7xfm2b000dl1lum8ex61mr	2	0	2026-01-10 06:31:15.853
cmk7xfm310026l1lujoef0ybw	cmk7xfm310022l1luyyvei3og	cmk7xfm2b000cl1lu9o5w6fm9	2	0	2026-01-10 06:31:15.853
cmk7xfm320029l1lu94s9dwf3	cmk7xfm310028l1lu34xvhg14	cmk7xfm2a000al1luwosx12es	1	0	2026-01-10 06:31:15.854
cmk7xfm32002al1lurataqplv	cmk7xfm310028l1lu34xvhg14	cmk7xfm280007l1lufz7tc5rx	1	0	2026-01-10 06:31:15.854
cmk7xfm32002bl1lu7ccb9ivl	cmk7xfm310028l1lu34xvhg14	cmk7xfm2g000wl1luay9f1btv	2	0	2026-01-10 06:31:15.854
cmk7xfm32002cl1luztdou8j2	cmk7xfm310028l1lu34xvhg14	cmk7xfm2d000ml1lud984zkw0	2	0	2026-01-10 06:31:15.854
cmk7xfm33002fl1luuybha334	cmk7xfm33002el1lu30z3v0kw	cmk7xfm2e000nl1luw23vr8uz	1	0	2026-01-10 06:31:15.856
cmk7xfm33002gl1lut70iqsod	cmk7xfm33002el1lu30z3v0kw	cmk7xfm2b000el1luvjrbtjph	1	0	2026-01-10 06:31:15.856
cmk7xfm33002hl1lux0bo6u8v	cmk7xfm33002el1lu30z3v0kw	cmk7xfm290009l1lujrsebu2c	2	0	2026-01-10 06:31:15.856
cmk7xfm33002il1luzqek1ofv	cmk7xfm33002el1lu30z3v0kw	cmk7xfm2f000sl1luhvkis23y	2	0	2026-01-10 06:31:15.856
cmk7xfm390037l1lujh7aexr3	cmk7xfm380036l1lugq8gg8di	cmk7xfm270004l1lu6i23vjk6	1	0	2026-01-10 06:31:15.861
cmk7xfm390038l1luzn6391me	cmk7xfm380036l1lugq8gg8di	cmk7xfm2c000il1lu5jpdk8n3	1	0	2026-01-10 06:31:15.861
cmk7xfm390039l1lu6xmph9fw	cmk7xfm380036l1lugq8gg8di	cmk7xfm2c000gl1luv8xa3jec	2	0	2026-01-10 06:31:15.861
cmk7xfm39003al1ludtzpo89k	cmk7xfm380036l1lugq8gg8di	cmk7xfm2d000jl1luvga15tsh	2	0	2026-01-10 06:31:15.861
cmk7xfm3a003dl1luu8gcqjpn	cmk7xfm3a003cl1lug3axjtn4	cmk7xfm2d000kl1lu9j0k99ri	1	0	2026-01-10 06:31:15.863
cmk7xfm3a003el1lu3dkhtg2t	cmk7xfm3a003cl1lug3axjtn4	cmk7xfm2e000pl1luzlmrj46o	1	0	2026-01-10 06:31:15.863
cmk7xfm3a003fl1lutirmexzm	cmk7xfm3a003cl1lug3axjtn4	cmk7xfm2h000yl1luw7x5vsk6	2	0	2026-01-10 06:31:15.863
cmk7xfm3a003gl1lub0oktio8	cmk7xfm3a003cl1lug3axjtn4	cmk7xfm2e000ol1luvard19cg	2	0	2026-01-10 06:31:15.863
cmk7xfm3b003jl1luck6z47ke	cmk7xfm3b003il1luh8lve11u	cmk7xfm2i000zl1lu7vs5skw3	1	0	2026-01-10 06:31:15.864
cmk7xfm3b003kl1lulydw5ti5	cmk7xfm3b003il1luh8lve11u	cmk7xfm2d000ll1lulsa3l4rv	1	0	2026-01-10 06:31:15.864
cmk7xfm3b003ll1luk1uhkwuq	cmk7xfm3b003il1luh8lve11u	cmk7xfm270004l1lu6i23vjk6	2	0	2026-01-10 06:31:15.864
cmk7xfm3b003ml1lutvhy47s0	cmk7xfm3b003il1luh8lve11u	cmk7xfm2c000gl1luv8xa3jec	2	0	2026-01-10 06:31:15.864
cmk7xfm3c003pl1lu5aoj4o19	cmk7xfm3c003ol1luvr63xlrc	cmk7xfm2c000il1lu5jpdk8n3	1	0	2026-01-10 06:31:15.865
cmk7xfm3c003ql1lukxpshna9	cmk7xfm3c003ol1luvr63xlrc	cmk7xfm2d000jl1luvga15tsh	1	0	2026-01-10 06:31:15.865
cmk7xfm3c003rl1lu9c3tzis2	cmk7xfm3c003ol1luvr63xlrc	cmk7xfm2d000kl1lu9j0k99ri	2	0	2026-01-10 06:31:15.865
cmk7xfm3c003sl1luotop040a	cmk7xfm3c003ol1luvr63xlrc	cmk7xfm2h000yl1luw7x5vsk6	2	0	2026-01-10 06:31:15.865
cmk7xfm3d003vl1luavg39eav	cmk7xfm3d003ul1luvncewskh	cmk7xfm2e000pl1luzlmrj46o	1	0	2026-01-10 06:31:15.866
cmk7xfm3d003wl1luaup1cl8b	cmk7xfm3d003ul1luvncewskh	cmk7xfm2e000ol1luvard19cg	1	0	2026-01-10 06:31:15.866
cmk7xfm3d003xl1luzjaqj44u	cmk7xfm3d003ul1luvncewskh	cmk7xfm2i000zl1lu7vs5skw3	2	0	2026-01-10 06:31:15.866
cmk7xfm3d003yl1lugzkv4sbv	cmk7xfm3d003ul1luvncewskh	cmk7xfm2d000ll1lulsa3l4rv	2	0	2026-01-10 06:31:15.866
cmk7xfm3j004nl1luov233pwy	cmk7xfm3i004ml1lu7q35eaix	cmk7xfm2g000ul1lud89p2ndp	1	0	2026-01-10 06:31:15.871
cmk7xfm3j004ol1luklc4jo31	cmk7xfm3i004ml1lu7q35eaix	cmk7xfm2f000tl1luozi486qq	1	0	2026-01-10 06:31:15.871
cmk7xfm3j004pl1luin4bhffi	cmk7xfm3i004ml1lu7q35eaix	cmk7xfm2a000bl1lumtdvb6k8	2	0	2026-01-10 06:31:15.871
cmk7xfm3j004ql1luflge7siv	cmk7xfm3i004ml1lu7q35eaix	cmk7xfm2c000fl1lu96b329or	2	0	2026-01-10 06:31:15.871
cmk7xfm3k004tl1lu4q20iaij	cmk7xfm3j004sl1lub3flm5i9	cmk7xfm2c000hl1lun88pe3uq	1	0	2026-01-10 06:31:15.872
cmk7xfm3k004ul1luvyy4s0bj	cmk7xfm3j004sl1lub3flm5i9	cmk7xfm260003l1lul3jayxot	1	0	2026-01-10 06:31:15.872
cmk7xfm3k004vl1lu8e9ncugl	cmk7xfm3j004sl1lub3flm5i9	cmk7xfm2h000xl1luhlszmdqn	2	0	2026-01-10 06:31:15.872
cmk7xfm3k004wl1luzd5cvm4w	cmk7xfm3j004sl1lub3flm5i9	cmk7xfm2g000vl1lubzhk5rdd	2	0	2026-01-10 06:31:15.872
cmk7xfm3l004zl1luen4jrbzq	cmk7xfm3l004yl1luj7zgbuk6	cmk7xfm2e000ql1lu4671jd8r	1	0	2026-01-10 06:31:15.874
cmk7xfm3l0050l1lulqusbcgu	cmk7xfm3l004yl1luj7zgbuk6	cmk7xfm2f000rl1lurl0tp65a	1	0	2026-01-10 06:31:15.874
cmk7xfm3l0051l1lu51os6s2y	cmk7xfm3l004yl1luj7zgbuk6	cmk7xfm2g000ul1lud89p2ndp	2	0	2026-01-10 06:31:15.874
cmk7xfm3l0052l1lup6mybd0n	cmk7xfm3l004yl1luj7zgbuk6	cmk7xfm2a000bl1lumtdvb6k8	2	0	2026-01-10 06:31:15.874
cmk7xfm3m0055l1lulsbo1bt3	cmk7xfm3m0054l1luo5f3fvrb	cmk7xfm2f000tl1luozi486qq	1	0	2026-01-10 06:31:15.874
cmk7xfm3m0056l1lupy1o7d4h	cmk7xfm3m0054l1luo5f3fvrb	cmk7xfm2c000fl1lu96b329or	1	0	2026-01-10 06:31:15.874
cmk7xfm3m0057l1lulkeca2y7	cmk7xfm3m0054l1luo5f3fvrb	cmk7xfm2c000hl1lun88pe3uq	2	0	2026-01-10 06:31:15.874
cmk7xfm3m0058l1luzkgm9z3u	cmk7xfm3m0054l1luo5f3fvrb	cmk7xfm2h000xl1luhlszmdqn	2	0	2026-01-10 06:31:15.874
cmk7xfm3n005bl1luyfrxbt54	cmk7xfm3m005al1lu6cnffvj8	cmk7xfm260003l1lul3jayxot	1	0	2026-01-10 06:31:15.875
cmk7xfm3n005cl1luyfxmyewm	cmk7xfm3m005al1lu6cnffvj8	cmk7xfm2g000vl1lubzhk5rdd	1	0	2026-01-10 06:31:15.875
cmk7xfm3n005dl1lup4gk14p1	cmk7xfm3m005al1lu6cnffvj8	cmk7xfm2e000ql1lu4671jd8r	2	0	2026-01-10 06:31:15.875
cmk7xfm3n005el1luol5bh6az	cmk7xfm3m005al1lu6cnffvj8	cmk7xfm2f000rl1lurl0tp65a	2	0	2026-01-10 06:31:15.875
\.


--
-- Data for Name: Player; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public."Player" (id, name, "totalScore", "isOnBench", "createdAt") FROM stdin;
cmk7xfm260003l1lul3jayxot	Matvey	0	f	2026-01-10 06:31:15.822
cmk7xfm270004l1lu6i23vjk6	Karim	0	f	2026-01-10 06:31:15.823
cmk7xfm280005l1lufef5k47v	Karim A.	0	f	2026-01-10 06:31:15.824
cmk7xfm280006l1luohz626zg	Alex	0	f	2026-01-10 06:31:15.825
cmk7xfm280007l1lufz7tc5rx	Colin Relton	0	f	2026-01-10 06:31:15.825
cmk7xfm290008l1lud4f2e5uj	Oliver Thirlwell Georgallis	0	f	2026-01-10 06:31:15.825
cmk7xfm290009l1lujrsebu2c	Iliana Thirlwell Georgallis	0	f	2026-01-10 06:31:15.826
cmk7xfm2a000al1luwosx12es	Rohan	0	f	2026-01-10 06:31:15.827
cmk7xfm2a000bl1lumtdvb6k8	Natalie	0	f	2026-01-10 06:31:15.827
cmk7xfm2b000cl1lu9o5w6fm9	Marios Savva	0	f	2026-01-10 06:31:15.827
cmk7xfm2b000dl1lum8ex61mr	Dimi	0	f	2026-01-10 06:31:15.828
cmk7xfm2b000el1luvjrbtjph	Steve Reynolds	0	f	2026-01-10 06:31:15.828
cmk7xfm2c000fl1lu96b329or	Lisa Groeger	0	f	2026-01-10 06:31:15.828
cmk7xfm2c000gl1luv8xa3jec	Andrey Sesyuk	0	f	2026-01-10 06:31:15.828
cmk7xfm2c000hl1lun88pe3uq	Sonya Loshak	0	f	2026-01-10 06:31:15.829
cmk7xfm2c000il1lu5jpdk8n3	Andreas Ch	0	f	2026-01-10 06:31:15.829
cmk7xfm2d000jl1luvga15tsh	Nico	0	f	2026-01-10 06:31:15.829
cmk7xfm2d000kl1lu9j0k99ri	Saif	0	f	2026-01-10 06:31:15.829
cmk7xfm2d000ll1lulsa3l4rv	Pandelis	0	f	2026-01-10 06:31:15.83
cmk7xfm2d000ml1lud984zkw0	Josh Geddes	0	f	2026-01-10 06:31:15.83
cmk7xfm2e000nl1luw23vr8uz	Alex Geddes	0	f	2026-01-10 06:31:15.83
cmk7xfm2e000ol1luvard19cg	Jordan Geddes	0	f	2026-01-10 06:31:15.83
cmk7xfm2e000pl1luzlmrj46o	Dima Zubkov	0	f	2026-01-10 06:31:15.831
cmk7xfm2e000ql1lu4671jd8r	Stephan	0	f	2026-01-10 06:31:15.831
cmk7xfm2f000rl1lurl0tp65a	Marianthi	0	f	2026-01-10 06:31:15.831
cmk7xfm2f000sl1luhvkis23y	Hannes	0	f	2026-01-10 06:31:15.831
cmk7xfm2f000tl1luozi486qq	Dean	0	f	2026-01-10 06:31:15.832
cmk7xfm2g000ul1lud89p2ndp	Richard	0	f	2026-01-10 06:31:15.832
cmk7xfm2g000vl1lubzhk5rdd	Sophie Efstathiou	0	f	2026-01-10 06:31:15.832
cmk7xfm2g000wl1luay9f1btv	Patrick	0	f	2026-01-10 06:31:15.833
cmk7xfm2h000xl1luhlszmdqn	Eka	0	f	2026-01-10 06:31:15.833
cmk7xfm2h000yl1luw7x5vsk6	Wayss	0	f	2026-01-10 06:31:15.833
cmk7xfm2i000zl1lu7vs5skw3	Maddy	0	f	2026-01-10 06:31:15.834
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public."Session" (id, "sessionNumber", status, "createdAt") FROM stdin;
cmk7xfm2i0010l1ludztl0cu8	1	active	2026-01-10 06:31:15.835
cmk7xfm2j0011l1luwlcgslv3	2	pending	2026-01-10 06:31:15.835
cmk7xfm2j0012l1lus0iu1hep	3	pending	2026-01-10 06:31:15.836
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: karimarnous
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
edb6b790-dad2-4f15-895f-b673384f6df8	a64db8cc3f39fbfa8fe1197bfab3d654372260a470c8cb2155319dc39a30a256	2026-01-09 21:50:23.021962+00	20260109215023_init	\N	\N	2026-01-09 21:50:23.010869+00	1
\.


--
-- Name: CourtAssignment CourtAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."CourtAssignment"
    ADD CONSTRAINT "CourtAssignment_pkey" PRIMARY KEY (id);


--
-- Name: CourtSession CourtSession_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."CourtSession"
    ADD CONSTRAINT "CourtSession_pkey" PRIMARY KEY (id);


--
-- Name: Court Court_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."Court"
    ADD CONSTRAINT "Court_pkey" PRIMARY KEY (id);


--
-- Name: GamePlayer GamePlayer_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."GamePlayer"
    ADD CONSTRAINT "GamePlayer_pkey" PRIMARY KEY (id);


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY (id);


--
-- Name: Player Player_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."Player"
    ADD CONSTRAINT "Player_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: CourtAssignment_courtSessionId_playerId_key; Type: INDEX; Schema: public; Owner: karimarnous
--

CREATE UNIQUE INDEX "CourtAssignment_courtSessionId_playerId_key" ON public."CourtAssignment" USING btree ("courtSessionId", "playerId");


--
-- Name: CourtSession_sessionId_courtId_key; Type: INDEX; Schema: public; Owner: karimarnous
--

CREATE UNIQUE INDEX "CourtSession_sessionId_courtId_key" ON public."CourtSession" USING btree ("sessionId", "courtId");


--
-- Name: Court_name_key; Type: INDEX; Schema: public; Owner: karimarnous
--

CREATE UNIQUE INDEX "Court_name_key" ON public."Court" USING btree (name);


--
-- Name: Court_order_key; Type: INDEX; Schema: public; Owner: karimarnous
--

CREATE UNIQUE INDEX "Court_order_key" ON public."Court" USING btree ("order");


--
-- Name: GamePlayer_gameId_playerId_key; Type: INDEX; Schema: public; Owner: karimarnous
--

CREATE UNIQUE INDEX "GamePlayer_gameId_playerId_key" ON public."GamePlayer" USING btree ("gameId", "playerId");


--
-- Name: Game_courtSessionId_gameNumber_key; Type: INDEX; Schema: public; Owner: karimarnous
--

CREATE UNIQUE INDEX "Game_courtSessionId_gameNumber_key" ON public."Game" USING btree ("courtSessionId", "gameNumber");


--
-- Name: Session_sessionNumber_key; Type: INDEX; Schema: public; Owner: karimarnous
--

CREATE UNIQUE INDEX "Session_sessionNumber_key" ON public."Session" USING btree ("sessionNumber");


--
-- Name: CourtAssignment CourtAssignment_courtSessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."CourtAssignment"
    ADD CONSTRAINT "CourtAssignment_courtSessionId_fkey" FOREIGN KEY ("courtSessionId") REFERENCES public."CourtSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourtAssignment CourtAssignment_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."CourtAssignment"
    ADD CONSTRAINT "CourtAssignment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourtSession CourtSession_courtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."CourtSession"
    ADD CONSTRAINT "CourtSession_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES public."Court"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourtSession CourtSession_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."CourtSession"
    ADD CONSTRAINT "CourtSession_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GamePlayer GamePlayer_gameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."GamePlayer"
    ADD CONSTRAINT "GamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES public."Game"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GamePlayer GamePlayer_playerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."GamePlayer"
    ADD CONSTRAINT "GamePlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES public."Player"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Game Game_courtSessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: karimarnous
--

ALTER TABLE ONLY public."Game"
    ADD CONSTRAINT "Game_courtSessionId_fkey" FOREIGN KEY ("courtSessionId") REFERENCES public."CourtSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict iT1JwgmUdxfOi6ThujDmk4LniETtAhDaFAnctLsHIdXYp2CGASEraCU0A7bkkPJ

